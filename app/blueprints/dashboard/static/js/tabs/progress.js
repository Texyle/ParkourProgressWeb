class ProgressTab {
    constructor() {
        this.draggedPlayer = null;
        this.draggedOverVictors = false;
    }

    init() {
        this.initMaps();
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

    async changeMap(mapId) {
        this.selectMapAnimation(mapId);

        const container = document.getElementById('progress-list-wrapper');
        container.classList.add('blur');

        // using this time to figure out remaining animation time
        // (to make sure that the data doesnt change before blur is fully applied)
        const startTime = Date.now();

        // generating random map data for now, replace with actual function later
        const mapData = generateRandomMapData();

        const elapsedTime = Date.now() - startTime;
        const remainingTransitionTime = Math.max(300 - elapsedTime, 0);

        setTimeout(() => {
            container.classList.remove('blur');

            this.createSections(mapData);
            this.createPlayers(mapData);

            this.initDragAndDrop();

            container.scrollTop = 0;
        }, remainingTransitionTime);
    }

    selectMapAnimation(mapId) {
        const maps = document.querySelectorAll('.progress-gamemode-maps li');

        maps.forEach(map => {
            var id = map.getAttribute('data-mapid');
            if (id == mapId) {
                map.classList.add('selected');
            } else {
                map.classList.remove('selected');
            }
        })
    }

    createSections(mapData) {
        // create

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

    createPlayers(mapData) {

    }

    initDragAndDrop() {
        const sectionPlayers = document.querySelectorAll('.progress-section-players');
        const victors = document.getElementById("progress-victors-container");
        const victorsOverlay = document.getElementById("progress-victors-overlay");

        console.log(sectionPlayers);

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

    initMaps() {
        // map loading should happen here

        const mapButtons = document.querySelectorAll(".progress-gamemode-maps li");

        mapButtons.forEach(item => {
            item.addEventListener("click", (evt) => {
                this.changeMap(evt.target.getAttribute("data-mapid"));
            });
        });
    }
}


// temporary function to generate random map data
function generateRandomMapData() {
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