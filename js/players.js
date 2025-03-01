const gamemodeButtons = {
    "Rankup": "Rankup",
    "Segmented": "Segmented",
    "Onlysprint": "Onlysprint",
    "Tag": "Tag",
    "Progress": "Progress"
};

async function loadVictories(name, gamemode) {
    const maps = document.getElementById("map-list");
    const maps_title = document.getElementById("map-title");
    maps.innerHTML = "Loading maps...";
    if (gamemode == "Progress") {
        maps_title.innerHTML = `Maps in Progress`;
    } else {
        maps_title.innerHTML = `${gamemode}`;
    }

    if (gamemode === "Progress") {
        response = await fetch("/load_progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });
    } else {
        response = await fetch("/load_victories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, gamemode: gamemode })
        });
    }

    const victories = await response.json();

    if (victories.length === 0) {
        maps.innerHTML = gamemode === "Progress" ? "No maps in progress." : "No maps completed in this gamemode.";
    } else {
        maps.innerHTML = victories
            .map((entry, index) => {
                if (gamemode === "Segmented") {
                    return `${index + 1}. ${entry.MapName}`;
                } 
                if (gamemode === "Onlysprint") {
                    return ["last stretch", "final stretch"].includes(entry.FailsMessage)
                        ? `${index + 1}. ${entry.MapName} - <i>${entry.Fails} ${entry.FailsMessage} fails</i>`
                        : `${index + 1}. ${entry.MapName}`;
                }

                if (gamemode === "Tag") {
                    return ["sky", "final stretch"].includes(entry.FailsMessage)
                        ? `${index + 1}. ${entry.MapName} - <i>${entry.Fails} ${entry.FailsMessage} fails</i>`
                        : `${index + 1}. ${entry.MapName}`;
                }

                if (gamemode === "Progress") {
                    return `${index + 1}. ${entry.MapName} - ${entry.SectionName}`;
                }

                return `${index + 1}. ${entry.MapName} - <i>${entry.Fails} ${entry.FailsMessage} fails</i>`;
            })
            .join("<br>");
    }
}

function resetGamemodeButtons(name) {
    const buttonsContainer = document.querySelector(".buttons");
    const newButtonsContainer = buttonsContainer.cloneNode(true);
    buttonsContainer.replaceWith(newButtonsContainer);

    Object.entries(gamemodeButtons).forEach(([buttonId, gamemode]) => {
        document.getElementById(buttonId).addEventListener("click", async () => {
            await loadVictories(name, gamemode);
        });
    });
}

document.getElementById("search-button").addEventListener("click", async () => {

    const modal = document.querySelector(".modal");
    const resultMessage = document.getElementById("result-message");
    const box = document.querySelector(".info-container");
    const ign = document.getElementById("ign");
    const country = document.getElementById("country");
    const avatar = document.getElementById("avatar");
    const name1 = document.getElementById("player-name").value;
    const name = name1.trim();

    if (name.includes(" ")) {
        modal.style.height = "6cm";
        resultMessage.textContent = "Name cannot contain spaces.";
        resultMessage.style.color = "red";
        box.style.display = "none";
        return;
    }

    if (name === "") {
        resultMessage.textContent = "Name cannot be empty.";
        resultMessage.style.color = "red";
        modal.style.height = "6cm";
        box.style.display = "none";
        return;
    }

    modal.style.height = "6cm";
    resultMessage.innerHTML = "Loading...";
    resultMessage.style.color = "white";

    try {
        const user_info = await fetch("/load_player_info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });

        const us_info = await user_info.json();

        if (user_info.ok) {
            resultMessage.textContent = "Success";
            resultMessage.style.color = "green";
            ign.innerHTML = `<b>IGN:</b> ${us_info.Nick}`;
            country.innerHTML = `<b>Country:</b> ${us_info.CountryCode || "Unknown"}`;
            avatar.src = `https://vzge.me/full/${name}`;

            let discord = document.getElementById("discord-link") || document.getElementById("non-member"); 

            if (us_info.DiscordID && us_info.DiscordID !== "-1") {
                discord.id = "discord-link"; 
                discord.setAttribute("href", `https://discord.com/users/${us_info.DiscordID}`);
                discord.setAttribute("target", "_");
                discord.innerHTML = "Click Here";
            } else {
                discord.id = "non-member";
                discord.innerHTML = "Non-Member";
                discord.removeAttribute("href");
                discord.removeAttribute("target");
            }

            box.style.display = "flex";

            await loadVictories(name, "Rankup");
            resetGamemodeButtons(name);

        } else {
            resultMessage.textContent = `Player ${name} does not exist.`;
            resultMessage.style.color = "red";
            box.style.display = "none";
        }

    } catch (error) {
        console.error("Error during fetch:", error);
        resultMessage.textContent = "An error occurred. Please try again.";
        resultMessage.style.color = "red";
        modal.style.height = "6cm";
        box.style.display = "none";
    }
});
