document.addEventListener('DOMContentLoaded', () => {
    initGamemodeTabs();
    initSearchInput();
});

function initGamemodeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    tabButtons[0].click();
}

function initSearchInput() {
    const searchInput = document.getElementById('map-search');

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        const tabContents = document.querySelectorAll('.tab-content');
        let anyVisibleInActiveTab = false;

        tabContents.forEach(tabContent => {
            const listContainers = tabContent.querySelectorAll('.list-container');
            let anyVisibleInTab = false;

            listContainers.forEach(listContainer => {
                const mapContainers = listContainer.querySelectorAll('.map-container');
                let anyVisibleInList = false;

                mapContainers.forEach(container => {
                    const mapName = container.querySelector('.map-name').textContent.toLowerCase();
                    if (mapName.includes(query)) {
                        container.style.display = '';
                        anyVisibleInList = true;
                    } else {
                        container.style.display = 'none';
                    }
                });

                if (!anyVisibleInList) {
                    listContainer.style.display = 'none';
                } else {
                    listContainer.style.display = '';
                    anyVisibleInTab = true;
                }
            });

            if (tabContent.classList.contains('active') && anyVisibleInTab) {
                anyVisibleInActiveTab = true;
            }
        });

        if (!anyVisibleInActiveTab) {
            tabContents.forEach(tabContent => {
                const listContainers = tabContent.querySelectorAll('.list-container');
                let anyVisibleInTab = false;

                listContainers.forEach(listContainer => {
                    if (listContainer.style.display !== 'none') {
                        anyVisibleInTab = true;
                    }
                });

                if (anyVisibleInTab) {
                    const tabId = tabContent.id;
                    document.querySelector(`.tab-button[data-tab="${tabId}"]`).click();
                    return;
                }
            });
        }
    });
}

function redirectToMapPage(mapId) {
    const currentUrl = window.location.href;

    const baseUrl = window.location.protocol + "//" + window.location.host;
    const newUrl = `${baseUrl}/map/${mapId}`;

    window.location.href = newUrl;
}