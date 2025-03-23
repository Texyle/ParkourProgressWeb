const input = document.getElementById('map-search');
const dropdownContainer = document.getElementById('suggestions-container');
const magnifyingGlassIcon = document.querySelector('.search-bar i');

function remToPixels(rem) {
    const baseFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    return rem * baseFontSize;
}

function findBestMatches(playerNames, input) {
    const query = input.toLowerCase();
    const exactPrefixMatches = [];
    const otherMatches = [];

    playerNames.forEach(name => {
        const lowerName = name.toLowerCase();
        if (lowerName.startsWith(query)) {
            exactPrefixMatches.push(name);
        } else if (lowerName.includes(query)) {
            otherMatches.push(name);
        }
    });

    exactPrefixMatches.sort();
    otherMatches.sort((a, b) => a.toLowerCase().indexOf(query) - b.toLowerCase().indexOf(query));

    const combinedMatches = exactPrefixMatches.concat(otherMatches);

    return combinedMatches.slice(0, 6);
}

function showSuggestions() {
    const query = input.value.toLowerCase();
    const matchingNames = findBestMatches(playerNames, query)

    dropdownContainer.innerHTML = '';

    const height = matchingNames.length * (remToPixels(1) + 16) + 6;

    if (query === '' || matchingNames.length === 0) {
        dropdownContainer.style.height = '0';
        return;
    }

    matchingNames.forEach(name => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = name;
        div.addEventListener('click', function () {
            input.value = name;
            dropdownContainer.style.height = '0';
        });
        dropdownContainer.appendChild(div);
    });

    dropdownContainer.style.height = height + 'px';
}

document.addEventListener('DOMContentLoaded', function () {

    input.addEventListener('input', function () {
        showSuggestions();
    });

    document.addEventListener('click', function (event) {
        if (!dropdownContainer.contains(event.target) && event.target !== input && event.target !== magnifyingGlassIcon) {
            dropdownContainer.style.height = '0';
        }
    });

    input.addEventListener('click', function () {
        showSuggestions();
    });
});
