class ProgressTab {
    constructor() {
        this.draggedPlayer = null;
        this.draggedOverVictors = false;

        this.initDragAndDrop();
    }

    updateProgress(playerItem) {
        let playerName = playerItem.innerHTML;

        const modal = new UpdateProgressModal(playerItem);
        modal.show();
    }

    setVictor(playerItem) {
        let playerName = playerItem.innerHTML;
        
        const modal = new SetVictorModal(playerItem);
        modal.show();
    }

    switchMap(mapId) {
        // generating random data for now
        const mapData = generateRandomObject();
        

        this.createSections(mapData);
        this.createPlayers(mapData);

        this.initDragAndDrop();
    }

    // create section list elements from data
    createSections(mapData) {
        const sectionsContainer = document.querySelector("#progress-sections");
        sectionsContainer.innerHTML = "";

        mapData.sections.forEach(section => {
            const sectionElement = document.createElement('li');
            sectionElement.className = 'progress-section';

            const sectionName = document.createElement('span');
            sectionName.className = 'progress-section-name';
            sectionName.textContent = section.name;

            sectionElement.appendChild(sectionName);

            const playersList = document.createElement('ul');
            playersList.className = 'progress-section-players';

            section.players.forEach(player => {
                const playerElement = document.createElement('li');
                playerElement.className = 'progress-section-player';
                playerElement.textContent = player.name;
                // add id

                playersList.appendChild(playerElement);
            });

            sectionElement.appendChild(playersList);

            sectionsContainer.appendChild(sectionElement);
        });
    }

    initDragAndDrop() {
        const sectionPlayers = document.querySelectorAll('.progress-section-players');
        const victors = document.getElementById("progress-victors-container");
        const victorsOverlay = document.getElementById("progress-victors-overlay");

        const options = {
            group: "progress-dnd",
            animation: 250,
            ghostClass: "progress-sortable-ghost",
            dragClass: "progress-sortable-drag",
            forceFallback: true,
            onStart: (evt) => {
                this.draggedPlayer = evt.item;
            },
            onEnd: (evt) => {
                if (this.draggedOverVictors) {
                    this.setVictor(evt.item);
                }

                this.draggedPlayer = null;
                victorsOverlay.style.opacity = 0;
            },
            onAdd: (evt) => {
                if (!this.draggedOverVictors)
                    this.updateProgress(evt.item);
            }
        };

        sectionPlayers.forEach(container => {
            Sortable.create(container, options);
        });

        victors.addEventListener("mouseenter", () => {
            this.draggedOverVictors = true;

            if (this.draggedPlayer != null)
                victorsOverlay.style.opacity = 1;
        });

        victors.addEventListener("mouseleave", () => {
            this.draggedOverVictors = false;

            victorsOverlay.style.opacity = 0;
        });
    }
}

// add click events on map buttons
document.addEventListener("DOMContentLoaded", function() {
    const mapButtons = document.querySelectorAll(".progress-gamemode-maps li");

    mapButtons.forEach(item => {
      item.addEventListener("click", function(event) {
        progressTab.switchMap(event.target.getAttribute("data-mapid"));
      });
    });
});



function generateRandomObject() {
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  };
  const generateRandomDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const sectionsCount = getRandomInt(5, 10);
  const sections = Array.from({ length: sectionsCount }, (_, i) => {
    const playersCount = getRandomInt(0, 10);
    const players = Array.from({ length: playersCount }, () => ({
      id: getRandomInt(1, 1000),
      name: generateRandomString(getRandomInt(3, 10))
    }));
    return { name: `S${i + 1}`, players };
  });

  const victorsCount = getRandomInt(0, 20);
  const victors = Array.from({ length: victorsCount }, () => ({
    id: getRandomInt(1, 1000),
    name: generateRandomString(getRandomInt(3, 10)),
    date: generateRandomDate(),
    fails: getRandomInt(0, 20)
  }));

  const failsMessage = Math.random() > 0.5 ? "sky" : null;

  return { sections, victors, failsMessage };
}