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
                        container.style.height = '';
                        anyVisibleInList = true;
                    } else {
                        container.style.height = '0'
                    }
                });

                if (!anyVisibleInList) {
                    let p = listContainer.querySelector('p');
                    p.style.fontSize = '0';
                } else {
                    let p = listContainer.querySelector('p');
                    p.style.fontSize = '3rem';

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
                    let p = listContainer.querySelector('p');
                    if (p.style.fontSize !== '0px') {
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