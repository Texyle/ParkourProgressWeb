document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/load_latest", { method: "POST" });
    const data = await response.json();

    const victorsList = data.victors.map((victor, index) => {
        const date = new Date(victor.date);
        const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `${index + 1}. ${victor.player_name} - ${victor.map_name} - ${formattedDate}`;
    });

    document.getElementById("latest_victors").innerHTML = victorsList.join("<br>");
});