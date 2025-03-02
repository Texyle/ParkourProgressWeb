document.addEventListener("DOMContentLoaded", function() {
    loadData("Pandora's Box");
});

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

document.getElementById('collapse-victors').addEventListener('click', function() {
    const listBox = document.getElementById('listBox');
    const table = document.querySelector('.victors-table');

    if (listBox.style.maxHeight) {
      listBox.style.maxHeight = null;
    } else {
      listBox.style.maxHeight = table.scrollHeight + 'px';
    }
  });