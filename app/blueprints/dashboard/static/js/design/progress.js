document.addEventListener("DOMContentLoaded", function () {
    const mapButtons = document.querySelectorAll(".progress-gamemode-maps li");

    mapButtons.forEach(item => {
      item.addEventListener("click", function(event) {
        selectProgressMap(event.target);
      });
    });

    doDragAndDrop();
});

function selectProgressMap(mapButton) {
    mapId = mapButton.getAttribute("data-mapid");
    sectionsContainer = document.getElementById("progress-sections-container");
}

function doDragAndDrop() {
    var sectionPlayers = document.querySelectorAll('.progress-section-players');

    const options = {
        group: "section",
        animation: 250,
        ghostClass: "progress-sortable-ghost"
    };

    sectionPlayers.forEach(container => {
        var sortable = Sortable.create(container, options);
    });
}