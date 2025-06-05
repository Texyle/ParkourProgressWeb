let draggedPlayer = null;
let draggedOverVictors = false;

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
    const sectionPlayers = document.querySelectorAll('.progress-section-players');
    const victors = document.getElementById("progress-victors-container");
    const victorsOverlay = document.getElementById("progress-victors-overlay");

    const options = {
        group: "progress-dnd",
        animation: 250,
        ghostClass: "progress-sortable-ghost",
        dragClass: "progress-sortable-drag",
        forceFallback: true,
        onStart: function(evt) {
            draggedPlayer = evt.item;
        },
        onEnd: function(evt) {
            if (draggedOverVictors) {
                setVictor(evt.item);
            }

            draggedPlayer = null;
            victorsOverlay.style.opacity = 0;
        },
        onAdd: function(evt) {
            updateProgress(evt.item);
        }
    };

    sectionPlayers.forEach(container => {
        Sortable.create(container, options);
    });

    victors.addEventListener("mouseenter", function() {
        draggedOverVictors = true;

        if (draggedPlayer != null)
            victorsOverlay.style.opacity = 1;
    });

    victors.addEventListener("mouseleave", function() {
        draggedOverVictors = false;

        victorsOverlay.style.opacity = 0;
    });
}

function updateProgress(playerItem) {
    let playerName = playerItem.innerHTML;

    const modal = new UpdateProgressModal(playerItem);
    modal.show();
}

function setVictor(playerItem) {
    let playerName = playerItem.innerHTML;
    
    const modal = new SetVictorModal(playerItem);
    modal.show();
}