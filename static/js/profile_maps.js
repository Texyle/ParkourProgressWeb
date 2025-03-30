document.addEventListener('DOMContentLoaded', function () {
    const mapsContainer = document.getElementById('map-list-container');
    const filterCheckboxes = document.querySelectorAll('#maps-gamemode-dropdown-content input[type="checkbox"]');
    const sortButtons = document.querySelectorAll('#maps-sort-dropdown-content button');

    function filterMaps() {
        const selectedGamemodes = Array.from(filterCheckboxes)
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

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterMaps);
    });

    sortButtons.forEach(button => {
        button.addEventListener('click', function () {
            const criteria = this.textContent.trim();
            sortMaps(criteria);
        });
    });
});
