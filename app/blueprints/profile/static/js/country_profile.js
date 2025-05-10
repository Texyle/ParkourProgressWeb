document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const magnifyingGlassIcon = document.querySelector('#search-bar i');

    const imageCache = {};

    function remToPixels(rem) {
        const baseFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
        return rem * baseFontSize;
    }

    function findBestMatches(countryObjects, input) {
        const query = input.toLowerCase();
        const exactPrefixMatches = [];
        const otherMatches = [];

        countryObjects.forEach(country => {
            const lowerName = country.Name.toLowerCase();
            const lowerCode = country.Code.toLowerCase();
            if (lowerName.startsWith(query) || lowerCode.startsWith(query)) {
                exactPrefixMatches.push(country);
            } else if (lowerName.includes(query) || lowerCode.includes(query)) {
                otherMatches.push(country);
            }
        });

        exactPrefixMatches.sort((a, b) => a.Name.localeCompare(b.Name));

        otherMatches.sort((a, b) => {
            const aIndex = Math.min(a.Name.toLowerCase().indexOf(query), a.Code.toLowerCase().indexOf(query));
            const bIndex = Math.min(b.Name.toLowerCase().indexOf(query), b.Code.toLowerCase().indexOf(query));
            return aIndex - bIndex;
        });

        const combinedMatches = exactPrefixMatches.concat(otherMatches);
        return combinedMatches.slice(0, 6);
    }

    function showSuggestions() {
        const query = input.value.toLowerCase();
        const matchingCountries = findBestMatches(countries, query);

        suggestionsContainer.innerHTML = '';

        const height = matchingCountries.length * (remToPixels(1) + 16) + 6;

        if (query === '' || matchingCountries.length === 0) {
            suggestionsContainer.style.height = '0';
            return;
        }

        matchingCountries.forEach(country => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';

            let img = imageCache[country.Code];
            if (!img) {
                img = document.createElement('img');
                img.src = `/static/${flags[country.Code]}`;
                img.alt = `${country.Name} Flag`;
                img.className = 'flag';
                imageCache[country.Code] = img;
            }

            div.appendChild(img);
            div.appendChild(document.createTextNode(` ${country.Name}`));

            const baseUrl = window.location.protocol + "//" + window.location.host;
            const newUrl = `${baseUrl}/profile/country/${country.Code}`;
            div.setAttribute('data-url', newUrl);

            div.addEventListener('click', function () {
                input.value = `${country.Name}`;
                suggestionsContainer.style.height = '0';
            });
            suggestionsContainer.appendChild(div);
        });

        suggestionsContainer.style.height = height + 'px';
    }

    input.addEventListener('input', function () {
        showSuggestions();
    });

    document.addEventListener('click', function (event) {
        if (!suggestionsContainer.contains(event.target) && event.target !== input && event.target !== magnifyingGlassIcon) {
            suggestionsContainer.style.height = '0';
        }
    });

    input.addEventListener('click', function () {
        showSuggestions();
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const firstSuggestion = document.querySelector('.suggestion-item:not([style*="display: none"])');
            if (firstSuggestion) {
                window.location.href = firstSuggestion.getAttribute('data-url');
            }
        }
    });

    suggestionsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('suggestion-item')) {
            window.location.href = event.target.getAttribute('data-url');
        }
    });

    checkFaces();

    doDropdowns();
});

document.addEventListener('mousemove', (event) => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.left = `${event.clientX+10}px`;
        popup.style.top = `${event.clientY}px`;
    });
});

function checkFaces() {
    var images = document.querySelectorAll('.player-face');

    images.forEach(function (img) {
        img.onerror = function () {
            img.src = 'https://vzge.me/face/X-Steve';
            img.onerror = null;
        };
    });
}

function redirectToPlayerPage(event, playerId) {
    const baseUrl = window.location.protocol + "//" + window.location.host;
    const newUrl = `${baseUrl}/profile/player/${playerId}`;

    window.location.href = newUrl;
    event.stopPropagation();
}

function redirectToMapPage(mapId) {
    const baseUrl = window.location.protocol + "//" + window.location.host;
    const newUrl = `${baseUrl}/map/${mapId}`;

    window.location.href = newUrl;
}

function selectOption(event, option) {
    event.stopPropagation();
    console.log("Selected option: " + option);

    var dropdownContent = event.target.parentElement;
    var dropdownButton = dropdownContent.previousElementSibling;

    dropdownButton.textContent = "Sort by: " + option;
}

function doDropdowns() {
    openCloseDropdowns();
    doFilters();
    doSorting();
    sortMaps();
}

function openCloseDropdowns() {
    function openDropdown(event) {
        var dropdownButton = event.target;
        var dropdownContent = dropdownButton.nextElementSibling;

        var openDropdowns = document.querySelectorAll(".profile-dropdown-content.open");
        openDropdowns.forEach(function(openDropdown) {
            if (openDropdown !== dropdownContent) {
                openDropdown.classList.remove("open");
            }
        });

        dropdownContent.classList.add("open");
    }

    function closeDropdown(event) {
        var dropdownContent = event.target;

        if (!dropdownContent.matches('.profile-dropdown-content') && !dropdownContent.closest('.profile-dropdown-content')) {
            var openDropdowns = document.querySelectorAll(".profile-dropdown-content.open");
            openDropdowns.forEach(function(openDropdown) {
                openDropdown.classList.remove("open");
            });
        }
    }

    function updateDropdownButtonStyle(dropdown) {
        var checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        var dropdownButton = dropdown.querySelector('.profile-dropdown-button');

        var allChecked = true;
        checkboxes.forEach(function(checkbox) {
            if (!checkbox.checked) {
                allChecked = false;
            }
        });

        if (!allChecked) {
            if (!dropdownButton.textContent.includes('*')) {
                dropdownButton.textContent += ' *';
            }
            dropdownButton.classList.add('filter-dropdown-changed');
        } else {
            dropdownButton.textContent = dropdownButton.textContent.replace(' *', '');
            dropdownButton.classList.remove('filter-dropdown-changed');
        }
    }

    var dropdownButtons = document.querySelectorAll('.profile-dropdown-button');
    dropdownButtons.forEach(function(button) {
        button.addEventListener('mouseenter', openDropdown);
    });

    var dropdownContents = document.querySelectorAll('.profile-dropdown');
    dropdownContents.forEach(function(dropdown) {
        dropdown.addEventListener('mouseleave', closeDropdown);
    });

    var checkboxes = document.querySelectorAll('.gamemode-dropdown input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var dropdown = checkbox.closest('.gamemode-dropdown');
            updateDropdownButtonStyle(dropdown);
        });
    });

    var checkboxes = document.querySelectorAll('.progress-dropdown input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var dropdown = checkbox.closest('.progress-dropdown');
            updateDropdownButtonStyle(dropdown);
        });
    });
}

function doFilters() {
    const filterCheckboxesGamemode = document.querySelectorAll('#maps-gamemode-dropdown-content input[type="checkbox"]');
    const filterCheckboxesProgress = document.querySelectorAll('#maps-progress-dropdown-content input[type="checkbox"]');
    const mapsContainer = document.getElementById('maps-list-container');

    filterCheckboxesGamemode.forEach(checkbox => {
        checkbox.addEventListener('change', filterMaps);
    });
    filterCheckboxesProgress.forEach(checkbox => {
        checkbox.addEventListener('change', filterMaps);
    });

    function filterMaps() {
        const selectedGamemodes = Array.from(filterCheckboxesGamemode)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.nextElementSibling.textContent);

        const selectedProgress = Array.from(filterCheckboxesProgress)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.nextElementSibling.textContent);

        const mapContainers = mapsContainer.querySelectorAll('.map-container');
        mapContainers.forEach(mapContainer => {
            const mapGamemode = mapContainer.querySelector('.map-gamemode').textContent.trim();
            const mapProgress = mapContainer.querySelector('.map-progress').getAttribute("data-progress");

            if (selectedGamemodes.includes(mapGamemode) && selectedProgress.includes(mapProgress)) {
                mapContainer.classList.remove('hidden');
            } else {
                mapContainer.classList.add('hidden');
            }
        });

        sortMaps(true);
    }
}

function doSorting() {
    const sortButtonsMaps = document.querySelectorAll('#maps-sort-dropdown-content button');
    const toggleButton = document.getElementById('sort-direction-button');
    const arrow = toggleButton.querySelector('.arrow');

    sortButtonsMaps.forEach(button => {
        button.addEventListener('click', function () {
            sortMaps();
        });
    });

    toggleButton.addEventListener('click', () => {
        if (arrow.textContent === '▼') {
            arrow.textContent = '▲';
        } else {
            arrow.textContent = '▼'; 
        }
        sortMaps();
    });
}

function sortMaps(instant) {
    const mapsContainer = document.getElementById('maps-list-container');
    const mapContainers = Array.from(mapsContainer.querySelectorAll('.map-container:not(.hidden)'));

    const sortButtonsMaps = document.getElementById('sort-button');
    const sortDirectionButton = document.getElementById('sort-direction-button');
    const arrow = sortDirectionButton.querySelector('.arrow');

    const criteria = sortButtonsMaps.textContent.replace("Sort by: ", "").trim();
    const direction = arrow.textContent;

    const sortedContainers = [...mapContainers].sort((a, b) => {
        let valueA, valueB, result = 0;
        if (criteria === 'Date') {
            const aProgressElement = a.querySelector('.map-progress[data-progress="Beaten"]');
            const bProgressElement = b.querySelector('.map-progress[data-progress="Beaten"]');

            if (aProgressElement && !bProgressElement) {
                result = -1;
            }
            if (!aProgressElement && bProgressElement) {
                result = 1;
            }

            if (aProgressElement && bProgressElement) {
                valueA = new Date(aProgressElement.querySelector('.map-progress-date').textContent.replace('on ', ''));
                valueB = new Date(bProgressElement.querySelector('.map-progress-date').textContent.replace('on ', ''));
                result = valueB - valueA;

                if (direction == '▲') {
                    result *= -1;
                }
            }

        } else if (criteria === 'Difficulty') {
            valueA = parseInt(a.getAttribute('data-position'));
            valueB = parseInt(b.getAttribute('data-position'));
            result = valueA - valueB;

            if (direction == '▲') {
                result *= -1;
            }
        }

        return result;
    });

    const containerHeight = mapContainers[0].offsetHeight;
    sortedContainers.forEach((container, index) => {
        const currentIndex = mapContainers.indexOf(container);
        const translateY = (index - currentIndex) * containerHeight;
        container.style.transition = 'transform 0.5s ease';
        container.style.transform = `translateY(${translateY}px)`;
    });

    if (!instant) {
        setTimeout(() => {
            sortedContainers.forEach(container => {
                mapsContainer.appendChild(container);
                container.style.transform = '';
                container.style.transition = '';
            });
        }, 500);
    } else {
        sortedContainers.forEach(container => {
            mapsContainer.appendChild(container);
            container.style.transform = '';
            container.style.transition = '';
        });
    }
}