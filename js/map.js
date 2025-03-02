async function loadData(name) {
    response = await fetch("/load_map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    });

    const map = await response.json();

    console.log(map.ScreenshotURL);
    document.body.style.backgroundImage = `url(${map.ScreenshotURL})`;
}

document.addEventListener("DOMContentLoaded", function() {
    loadData("Pandora's Box");
});
