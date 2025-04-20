document.addEventListener("DOMContentLoaded", function () {
    const mapButtons = document.querySelectorAll(".progress-gamemode-maps li");

    mapButtons.forEach(item => {
      item.addEventListener("click", function(event) {
        selectProgressMap(event.target);
      });
    });
});

function selectProgressMap(mapButton) {
    mapId = mapButton.getAttribute("data-mapid");
    sectionsContainer = document.getElementById("progress-sections-container");
}

document.addEventListener('DOMContentLoaded', function () {
  var progressSections = document.querySelectorAll('.progress-section-players');

  progressSections.forEach(function (section) {
    new Sortable(section, {
      group: 'shared',
      animation: 300,
      ghostClass: 'sortable-drag',
      dragClass: 'sortable-drag',
      chosenClass: 'sortable-chosen',
      fallbackOnBody: true,
      fallbackTolerance: 5,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      onEnd: function (evt) {
        console.log('Item moved from', evt.from, 'to', evt.to);
      }
    });
  });
});