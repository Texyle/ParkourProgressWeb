document.addEventListener('DOMContentLoaded', function () {
    // const mapsContainer = document.getElementById('map-list-container');
    // const filterCheckboxesMaps = document.querySelectorAll('#maps-gamemode-dropdown-content input[type="checkbox"]');
    // const sortButtonsMaps = document.querySelectorAll('#maps-sort-dropdown-content button');

    // const progressContainer = document.getElementById('progress-list-container');
    // const filterCheckboxesProgress = document.querySelectorAll('#profile-gamemode-dropdown-content input[type="checkbox"]');
    // const sortButtonsProgress = document.querySelectorAll('#progress-sort-dropdown-content button');

    // function filterMaps() {
    //     const selectedGamemodes = Array.from(filterCheckboxesMaps)
    //         .filter(checkbox => checkbox.checked)
    //         .map(checkbox => checkbox.nextElementSibling.nextElementSibling.textContent);

    //     const mapContainers = mapsContainer.querySelectorAll('.map-container');
    //     mapContainers.forEach(mapContainer => {
    //         const mapGamemode = mapContainer.querySelector('.map-gamemode').textContent.trim();
    //         if (selectedGamemodes.includes(mapGamemode)) {
    //             mapContainer.classList.remove('hidden');
    //         } else {
    //             mapContainer.classList.add('hidden');
    //         }
    //     });
    // }

    // function sortMaps(criteria) {
    //     const mapContainers = Array.from(mapsContainer.querySelectorAll('.map-container:not(.hidden)'));
    //     const sortedContainers = [...mapContainers].sort((a, b) => {
    //         let valueA, valueB;
    //         if (criteria === 'Recent') {
    //             valueA = new Date(a.querySelector('.map-date').textContent);
    //             valueB = new Date(b.querySelector('.map-date').textContent);
    //             return valueB - valueA;
    //         } else if (criteria === 'Difficulty') {
    //             valueA = parseInt(a.getAttribute('data-position'));
    //             valueB = parseInt(b.getAttribute('data-position'));
    //             return valueA - valueB;
    //         }
    //     });

    //     const containerHeight = mapContainers[0].offsetHeight;
    //     sortedContainers.forEach((container, index) => {
    //         const currentIndex = mapContainers.indexOf(container);
    //         const translateY = (index - currentIndex) * containerHeight;
    //         container.style.transition = 'transform 0.5s ease';
    //         container.style.transform = `translateY(${translateY}px)`;
    //     });

    //     setTimeout(() => {
    //         sortedContainers.forEach(container => {
    //             mapsContainer.appendChild(container);
    //             container.style.transform = '';
    //             container.style.transition = '';
    //         });
    //     }, 500);
    // }

    // function filterProgress() {
    //     const selectedGamemodes = Array.from(filterCheckboxesProgress)
    //         .filter(checkbox => checkbox.checked)
    //         .map(checkbox => checkbox.nextElementSibling.nextElementSibling.textContent);

    //     const progressContainers = progressContainer.querySelectorAll('.progress-container');
    //     progressContainers.forEach(progressContainer => {
    //         const progressGamemode = progressContainer.querySelector('.progress-gamemode').textContent.trim();
    //         if (selectedGamemodes.includes(progressGamemode)) {
    //             progressContainer.classList.remove('hidden');
    //         } else {
    //             progressContainer.classList.add('hidden');
    //         }
    //     });
    // }

    // function sortProgress(criteria) {
    //     const progressContainers = Array.from(progressContainer.querySelectorAll('.progress-container:not(.hidden)'));
    //     const sortedContainers = [...progressContainers].sort((a, b) => {
    //         let valueA, valueB;
    //         if (criteria === 'Recent') {
    //             valueA = new Date(a.querySelector('.progress-date').textContent);
    //             valueB = new Date(b.querySelector('.progress-date').textContent);
    //             return valueB - valueA;
    //         } else if (criteria === 'Difficulty') {
    //             valueA = parseInt(a.getAttribute('data-position'));
    //             valueB = parseInt(b.getAttribute('data-position'));
    //             return valueA - valueB;
    //         }
    //     });

    //     const containerHeight = progressContainers[0].offsetHeight;
    //     sortedContainers.forEach((container, index) => {
    //         const currentIndex = progressContainers.indexOf(container);
    //         const translateY = (index - currentIndex) * containerHeight;
    //         container.style.transition = 'transform 0.5s ease';
    //         container.style.transform = `translateY(${translateY}px)`;
    //     });

    //     setTimeout(() => {
    //         sortedContainers.forEach(container => {
    //             progressContainer.appendChild(container);
    //             container.style.transform = '';
    //             container.style.transition = '';
    //         });
    //     }, 500);
    // }

    // filterCheckboxesMaps.forEach(checkbox => {
    //     checkbox.addEventListener('change', filterMaps);
    // });

    // sortButtonsMaps.forEach(button => {
    //     button.addEventListener('click', function () {
    //         const criteria = this.textContent.trim();
    //         sortMaps(criteria);
    //     });
    // });

    // filterCheckboxesProgress.forEach(checkbox => {
    //     checkbox.addEventListener('change', filterProgress);
    // });

    // sortButtonsProgress.forEach(button => {
    //     button.addEventListener('click', function () {
    //         const criteria = this.textContent.trim();
    //         sortProgress(criteria);
    //     });
    // });

    doDropdowns();
});

function redirectToMapPage(mapId) {
    const currentUrl = window.location.href;

    const baseUrl = window.location.protocol + "//" + window.location.host;
    const newUrl = `${baseUrl}/map/${mapId}`;

    window.location.href = newUrl;
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
}

function doFilters() {
    const filterCheckboxesGamemode = document.querySelectorAll('#maps-gamemode-dropdown-content input[type="checkbox"]');
    const filterCheckboxesGamemodeProgress = document.querySelectorAll('#progress-gamemode-dropdown-content input[type="checkbox"]');

    const mapsContainer = document.getElementById('map-list-container');
    const progressContainer = document.getElementById('progress-list-container');

    filterCheckboxesGamemode.forEach(checkbox => {
        checkbox.addEventListener('change', filterMaps);
    });
    filterCheckboxesGamemodeProgress.forEach(checkbox => {
        checkbox.addEventListener('change', filterProgress);
    });

    function filterMaps() {
        const selectedGamemodes = Array.from(filterCheckboxesGamemode)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.nextElementSibling.textContent);

        const mapContainers = mapsContainer.querySelectorAll('.map-container');
        mapContainers.forEach(mapContainer => {
            const mapGamemode = mapContainer.querySelector('.map-gamemode').textContent.trim();

            if (selectedGamemodes.includes(mapGamemode)) {
                mapContainer.classList.remove('hidden');
            } else {
                mapContainer.classList.add('hidden');
            }
        });

        sortMaps(true);
    }

    function filterProgress() {
        const selectedGamemodes = Array.from(filterCheckboxesGamemodeProgress)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.nextElementSibling.textContent);

        const progressContainers = progressContainer.querySelectorAll('.progress-container');
        progressContainers.forEach(progressContainer => {
            const progressGamemode = progressContainer.querySelector('.progress-gamemode').textContent.trim();

            if (selectedGamemodes.includes(progressGamemode)) {
                progressContainer.classList.remove('hidden');
            } else {
                progressContainer.classList.add('hidden');
            }
        });
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
    const mapsContainer = document.getElementById('map-list-container');
    const mapContainers = Array.from(mapsContainer.querySelectorAll('.map-container:not(.hidden)'));

    const sortButtonsMaps = document.getElementById('sort-button');
    const sortDirectionButton = document.getElementById('sort-direction-button');
    const arrow = sortDirectionButton.querySelector('.arrow');

    const criteria = sortButtonsMaps.textContent.replace("Sort by: ", "").trim();
    const direction = arrow.textContent;

    const sortedContainers = [...mapContainers].sort((a, b) => {
        let valueA, valueB, result = 0;
        if (criteria === 'Date') {
            valueA = new Date(a.querySelector('.map-date').textContent);
            valueB = new Date(b.querySelector('.map-date').textContent);

            result = valueA - valueB;

            if (direction == '▲') {
                result *= -1;
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