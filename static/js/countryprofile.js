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
});
