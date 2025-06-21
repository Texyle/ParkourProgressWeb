class ProgressTab {
    constructor() {
        this.draggedPlayer = null;
        this.draggedOverVictors = false;
        this.sortables = [];
    }

    init() {
        this.initMaps();
        this.initDragAndDrop();
        this.initSearchBars();
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

    // load and display map data
    async selectMap(mapId) {
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
            this.createVictors(mapData);

            this.initDragAndDrop();

            container.scrollTop = 0;
        }, remainingTransitionTime);
    }

    // visually unselect previously selected map and select one that was clicked
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

    // creating section elements from passed data
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
                // add id here

                playersList.appendChild(playerElement);
            });

            sectionElement.appendChild(playersList);

            sectionsContainer.appendChild(sectionElement);
        });
    }

    // creating victor elements from passed data
    createVictors(mapData) {
        const victorsContainer = document.querySelector("#progress-victors");
        victorsContainer.innerHTML = "";

        const template = document.getElementById('victor-row-template');
        const templateContent = template.content;

        let index = 1;

        mapData.victors.forEach(victor => {
            const newRow = templateContent.cloneNode(true);
            newRow.querySelector('.progress-victor-index').textContent = `${victor.victorIndex}. `;
            newRow.querySelector('.progress-victor-name').textContent = victor.name;
            newRow.querySelector('.progress-victor-date').textContent = formatDate(victor.date);
            newRow.querySelector('.progress-victor-fails').textContent = victor.fails;

            victorsContainer.appendChild(newRow);
        });
    }

    // filter map list based on search bar input
    searchMaps(inputText) {
        const gamemodes = document.querySelectorAll('.progress-gamemode');
        let foundMaps = 0;
        let foundMapId;

        gamemodes.forEach(gamemode => {
            const maps = gamemode.querySelectorAll('.progress-gamemode-maps li');
            let foundMapInGamemode = false;

            maps.forEach(map => {
                const mapName = map.innerHTML;

                if (!mapName.toLowerCase().includes(inputText.toLowerCase())) {
                    map.style.maxHeight = 0;
                    map.style.visibility = 'hidden';
                } else {
                    map.style.maxHeight = null;
                    map.style.visibility = 'visible';
                    foundMaps += 1;
                    foundMapId = map.getAttribute('data-mapid');
                    foundMapInGamemode = true;
                }
            });

            if (!foundMapInGamemode) {
                gamemode.style.display = 'none';
            } else {
                gamemode.style.display = 'flex';
            }
        });

        // if only a single map matched input text, automatically select it
        if (foundMaps == 1) {
            this.selectMap(foundMapId);
        }
    }
    
    // filter player list based on search bar input
    // apparently there's no way to do this smoothly with sortableJS containers
    searchPlayers(inputText) {
        const sections = document.querySelectorAll('.progress-section');

        sections.forEach(section => {
            const players = section.querySelectorAll('.progress-section-player');

            players.forEach(player => {
                const playerName = player.innerHTML;
                if (!playerName.toLowerCase().includes(inputText.toLowerCase())) {
                    player.style.display = 'none';
                } else {
                    player.style.display = null;
                }
            });
        });
    }

    // make players draggable
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

        this.sortables = [];
        sectionPlayers.forEach(container => {
            this.sortables.push(Sortable.create(container, options));
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

    // load map list
    initMaps() {
        // insert map loading function

        const mapButtons = document.querySelectorAll(".progress-gamemode-maps li");

        mapButtons.forEach(item => {
            item.addEventListener("click", (evt) => {
                this.selectMap(evt.target.getAttribute("data-mapid"));
            });
        });
    }

    // assign event listeners to search bars
    initSearchBars() {
        const mapsSearchBar = document.getElementById('progress-map-search');
        const playersSearchBar = document.getElementById('progress-player-search');

        mapsSearchBar.addEventListener('input', (event) => {
            this.searchMaps(event.target.value);
        });

        playersSearchBar.addEventListener('input', (event) => {
            this.searchPlayers(event.target.value);
        });
    }
}


// temporary function to generate random map data
function generateRandomMapData() {
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // List of 32 English first names
  const firstNames = [
    "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen",
    "Ivy", "Jack", "Kate", "Leo", "Mia", "Nina", "Oscar", "Paul",
    "Quinn", "Rose", "Sam", "Tara", "Ursula", "Victor", "Wendy", "Xena",
    "Yara", "Zack", "Amy", "Brian", "Claire", "Diana", "Ethan", "Fiona"
  ];

  // Function to get a random name from the list of first names
  const getRandomName = () => {
    const randomIndex = getRandomInt(0, firstNames.length - 1);
    return firstNames[randomIndex];
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
      name: getRandomName() // Use the random name from the list
    }));
    return { name: `S${i + 1}`, players };
  });

  const victorsCount = getRandomInt(0, 20);
  const victors = Array.from({ length: victorsCount }, (_, index) => ({
    id: getRandomInt(1, 1000),
    name: getRandomName(), // Use the random name from the list
    date: generateRandomDate(),
    fails: getRandomInt(0, 20),
    victorIndex: index + 1 // Adding victorIndex starting from 1
  }));

  const failsMessage = Math.random() > 0.5 ? "sky" : null;

  return { sections, victors, failsMessage };
}