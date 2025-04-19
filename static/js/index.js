document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/load_latest", { method: "POST" });
    const data = await response.json();

    const container = document.getElementById("latest_victors");
    container.innerHTML = "";

    data.victors.forEach((victor, index) => {
        const row = document.createElement("div");
        row.classList.add("victor-row");

        const indexSpan = document.createElement("span");
        indexSpan.textContent = `${index + 1}. `;

        const playerSpan = document.createElement("span");
        playerSpan.classList.add("player-item");
        playerSpan.textContent = victor.player_name;
        playerSpan.onclick = () => {
            window.location.href = `/profile/player/${victor.ID}`;
        };

        const separator1 = document.createElement("span");
        separator1.textContent = " - ";

        const mapSpan = document.createElement("span");
        mapSpan.classList.add("map-item");
        mapSpan.textContent = victor.map_name;
        mapSpan.onclick = () => {
            window.location.href = `/map/${victor.MapID}`;
        };

        const separator2 = document.createElement("span");
        separator2.textContent = " - ";

        const dateSpan = document.createElement("span");
        const date = new Date(victor.date);
        dateSpan.textContent = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        row.appendChild(indexSpan);
        row.appendChild(playerSpan);
        row.appendChild(separator1);
        row.appendChild(mapSpan);
        row.appendChild(separator2);
        row.appendChild(dateSpan);

        container.appendChild(row);
    });
});
