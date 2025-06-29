class ProgressTab {
    constructor() {
        this.draggedPlayer = null;
        this.draggedOverVictors = false;
    }

    init() {
        this.initMaps();
        this.initDragAndDrop();
        this.initSearchBars();
    }

    showUpdateProgressModal(playerItem) {
        let playerName = playerItem.innerHTML;

        const modal = new UpdateProgressModal(this.confirmUpdateProgress.bind(this));
        modal.show();
    }

    showSetVictorModal(playerItem) {
        let playerName = playerItem.innerHTML;
        
        const modal = new SetVictorModal(this.confirmSetVictor, true);
        modal.show();
    }

    confirmUpdateProgress() {
        console.log('test');
    }

    confirmSetVictor() {
        console.log('test2');
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

            this.draggedPlayer = null;
            this.draggedOverVictors = false;
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

    // creating victor elements from passed data (must be sorted beforehand!)
    createVictors(mapData) {
        const victorsContainer = document.querySelector("#progress-victors");
        victorsContainer.innerHTML = "";

        const template = document.getElementById('victor-row-template');
        const templateContent = template.content;

        mapData.victors.forEach((victor, index) => {
            const newRow = templateContent.cloneNode(true);
            const rowElement = newRow.querySelector('li');
            rowElement.setAttribute('data-playerid', victor.id);
            newRow.querySelector('.progress-victor-index').textContent = `${victor.victorIndex}. `;
            newRow.querySelector('.progress-victor-name').textContent = victor.name;
            newRow.querySelector('.progress-victor-date').textContent = formatDate(victor.date);
            newRow.querySelector('.progress-victor-fails').textContent = victor.fails;

            // add move up/down buttons to victors with same dates
            const moveUpButton = newRow.querySelector('.progress-victor-button-move-up');
            const moveDownButton = newRow.querySelector('.progress-victor-button-move-down');

            moveDownButton.onclick = () => {
                this.moveVictor(victor.id, false);
            };
            moveUpButton.onclick = () => {
                this.moveVictor(victor.id, true);
            };

            if (index == 0 && moveUpButton) {
                this.toggleMoveVictorButton(moveUpButton, false);
            } else if (index > 0) {
                const prevVictor = mapData.victors[index - 1];
                if (prevVictor.date.getTime() != victor.date.getTime() && moveUpButton) {
                    this.toggleMoveVictorButton(moveUpButton, false);
                }
            }

            if (index == mapData.victors.length - 1 && moveDownButton) {
                this.toggleMoveVictorButton(moveDownButton, false);
            } else if (index < mapData.victors.length - 1) {
                const nextVictor = mapData.victors[index + 1];
                if (nextVictor.date.getTime() != victor.date.getTime() && moveDownButton) {
                    this.toggleMoveVictorButton(moveDownButton, false);
                }
            }

            victorsContainer.appendChild(newRow);
        });
    }

    moveVictor(id, moveUp) {
        const list = document.querySelector('#progress-victors');
        const victor = list.querySelector(`li[data-playerid="${id}"]`);

        // remember old positions
        const items = Array.from(list.children);
        const firstRects = items.map(item => item.getBoundingClientRect());

        // move items in DOM
        let other;
        if (moveUp) {
            other = victor.previousElementSibling;
            if (other) {
                list.insertBefore(victor, other);
            }
        } else {
            other = victor.nextElementSibling;
            if (other) {
                list.insertBefore(other, victor);
            }
        }

        // get new positions
        const lastRects = items.map(item => item.getBoundingClientRect());

        // animate smooth movement from old positions to new
        items.forEach((item, i) => {
            const dx = firstRects[i].left - lastRects[i].left;
            const dy = firstRects[i].top - lastRects[i].top;
            if (dx || dy) {
                item.style.transition = 'none';
                item.style.transform = `translate(${dx}px, ${dy}px)`;
                item.offsetWidth;
                item.style.transition = 'transform 0.3s';
                item.style.transform = '';
                item.addEventListener('transitionend', function handler() {
                    item.style.transition = '';
                    item.removeEventListener('transitionend', handler);
                });
            }
        });

        // fix up/down buttons
        [victor, other].forEach(item => {
            const upBtn = item.querySelector('.progress-victor-button-move-up');
            const downBtn = item.querySelector('.progress-victor-button-move-down');
            if (upBtn) this.toggleMoveVictorButton(upBtn, true);
            if (downBtn) this.toggleMoveVictorButton(downBtn, true);
        });

        const first = list.firstElementChild;
        const last = list.lastElementChild;
        if (first) {
            const upBtn = first.querySelector('.progress-victor-button-move-up');
            if (upBtn) this.toggleMoveVictorButton(upBtn, false);
        }
        if (last) {
            const downBtn = last.querySelector('.progress-victor-button-move-down');
            if (downBtn) this.toggleMoveVictorButton(downBtn, false);
        }
    }

    // filter map list based on search bar input
    searchMaps(inputText) {
        const gamemodes = document.querySelectorAll('.progress-gamemode');
        let foundMaps = 0;
        let foundMapId;
        let changed = false;

        gamemodes.forEach(gamemode => {
            const maps = gamemode.querySelectorAll('.progress-gamemode-maps li');
            let foundMapInGamemode = false;

            maps.forEach(map => {
                const mapName = map.innerHTML;

                if (!mapName.toLowerCase().includes(inputText.toLowerCase())) {
                    map.style.maxHeight = 0;
                    console.log(map.style.visibility);
                    if (map.style.visibility == 'visible' || map.style.visibility == '') {
                        map.style.visibility = 'hidden';
                        changed = true;
                    }
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
        if (foundMaps == 1 && changed) {
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

    toggleAddVictorOverlay(visible) {
        const victorsOverlay = document.getElementById("progress-victors-overlay");

        if (visible) {
            victorsOverlay.style.opacity = 1;
            victorsOverlay.style.pointerEvents = 'all';
        } else {
            victorsOverlay.style.opacity = 0;
            victorsOverlay.style.pointerEvents = 'none';
        }
    }

    toggleMoveVictorButton(button, enabled) {
        if (enabled) {
            button.style.opacity = 1;
            button.disabled = false;
            button.style.cursor = 'pointer'
        } else {
            button.style.opacity = 0;
            button.disabled = true;
            button.style.cursor = 'default'
        }
    }

    // make players draggable
    initDragAndDrop() {
        const sectionPlayers = document.querySelectorAll('.progress-section-players');
        const victors = document.getElementById("progress-victors-container");

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
                    this.showSetVictorModal(evt.item);
                }

                this.draggedPlayer = null;
                this.toggleAddVictorOverlay(false);
            },
            onAdd: (evt) => {
                if (!this.draggedOverVictors)
                    this.showUpdateProgressModal(evt.item);
            }
        };

        sectionPlayers.forEach(container => {
            Sortable.create(container, options);
        });

        victors.addEventListener("mouseenter", () => {
            this.draggedOverVictors = true;

            if (this.draggedPlayer != null)
                this.toggleAddVictorOverlay(true);
        });

        victors.addEventListener("mouseleave", () => {
            this.draggedOverVictors = false;

            this.toggleAddVictorOverlay(false);
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
    return new Date(2025, 5, 28);

    const start = new Date(2025, 5, 28);
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