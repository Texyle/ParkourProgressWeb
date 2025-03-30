document.addEventListener('DOMContentLoaded', function () {
    const mapsContainer = document.getElementById('map-list-container');
    const filterCheckboxesMaps = document.querySelectorAll('#maps-gamemode-dropdown-content input[type="checkbox"]');
    const sortButtonsMaps = document.querySelectorAll('#maps-sort-dropdown-content button');

    const progressContainer = document.getElementById('progress-list-container');
    const filterCheckboxesProgress = document.querySelectorAll('#profile-gamemode-dropdown-content input[type="checkbox"]');
    const sortButtonsProgress = document.querySelectorAll('#progress-sort-dropdown-content button');

    function filterMaps() {
        const selectedGamemodes = Array.from(filterCheckboxesMaps)
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
    }

    function sortMaps(criteria) {
        const mapContainers = Array.from(mapsContainer.querySelectorAll('.map-container:not(.hidden)'));
        const sortedContainers = [...mapContainers].sort((a, b) => {
            let valueA, valueB;
            if (criteria === 'Recent') {
                valueA = new Date(a.querySelector('.map-date').textContent);
                valueB = new Date(b.querySelector('.map-date').textContent);
                return valueB - valueA;
            } else if (criteria === 'Difficulty') {
                valueA = parseInt(a.getAttribute('data-position'));
                valueB = parseInt(b.getAttribute('data-position'));
                return valueA - valueB;
            }
        });

        const containerHeight = mapContainers[0].offsetHeight;
        sortedContainers.forEach((container, index) => {
            const currentIndex = mapContainers.indexOf(container);
            const translateY = (index - currentIndex) * containerHeight;
            container.style.transition = 'transform 0.5s ease';
            container.style.transform = `translateY(${translateY}px)`;
        });

        setTimeout(() => {
            sortedContainers.forEach(container => {
                mapsContainer.appendChild(container);
                container.style.transform = '';
                container.style.transition = '';
            });
        }, 500);
    }

    function filterProgress() {
        console.log("asd");
        const selectedGamemodes = Array.from(filterCheckboxesProgress)
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

    function sortProgress(criteria) {
        const progressContainers = Array.from(progressContainer.querySelectorAll('.progress-container:not(.hidden)'));
        const sortedContainers = [...progressContainers].sort((a, b) => {
            let valueA, valueB;
            if (criteria === 'Recent') {
                valueA = new Date(a.querySelector('.progress-date').textContent);
                valueB = new Date(b.querySelector('.progress-date').textContent);
                return valueB - valueA;
            } else if (criteria === 'Difficulty') {
                valueA = parseInt(a.getAttribute('data-position'));
                valueB = parseInt(b.getAttribute('data-position'));
                return valueA - valueB;
            }
        });

        const containerHeight = progressContainers[0].offsetHeight;
        sortedContainers.forEach((container, index) => {
            const currentIndex = progressContainers.indexOf(container);
            const translateY = (index - currentIndex) * containerHeight;
            container.style.transition = 'transform 0.5s ease';
            container.style.transform = `translateY(${translateY}px)`;
        });

        setTimeout(() => {
            sortedContainers.forEach(container => {
                progressContainer.appendChild(container);
                container.style.transform = '';
                container.style.transition = '';
            });
        }, 500);
    }

    filterCheckboxesMaps.forEach(checkbox => {
        checkbox.addEventListener('change', filterMaps);
    });

    sortButtonsMaps.forEach(button => {
        button.addEventListener('click', function () {
            const criteria = this.textContent.trim();
            sortMaps(criteria);
        });
    });

    filterCheckboxesProgress.forEach(checkbox => {
        checkbox.addEventListener('change', filterProgress);
    });

    sortButtonsProgress.forEach(button => {
        button.addEventListener('click', function () {
            const criteria = this.textContent.trim();
            sortProgress(criteria);
        });
    });
});
