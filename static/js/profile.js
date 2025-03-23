const input = document.getElementById('map-search');
const suggestionsContainer = document.getElementById('suggestions-container');
const magnifyingGlassIcon = document.querySelector('.search-bar i');

function remToPixels(rem) {
    const baseFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    return rem * baseFontSize;
}

function findBestMatches(playerObjects, input) {
    const query = input.toLowerCase();
    const exactPrefixMatches = [];
    const otherMatches = [];

    playerObjects.forEach(player => {
        const lowerName = player.Name.toLowerCase();
        if (lowerName.startsWith(query)) {
            exactPrefixMatches.push(player);
        } else if (lowerName.includes(query)) {
            otherMatches.push(player);
        }
    });

    exactPrefixMatches.sort((a, b) => a.Name.localeCompare(b.Name));

    otherMatches.sort((a, b) => a.Name.toLowerCase().indexOf(query) - b.Name.toLowerCase().indexOf(query));

    const combinedMatches = exactPrefixMatches.concat(otherMatches);
    return combinedMatches.slice(0, 6);
}

function showSuggestions() {
    const query = input.value.toLowerCase();
    const matchingNames = findBestMatches(playerNames, query)

    suggestionsContainer.innerHTML = '';

    const height = matchingNames.length * (remToPixels(1) + 16) + 6;

    if (query === '' || matchingNames.length === 0) {
        suggestionsContainer.style.height = '0';
        return;
    }

    matchingNames.forEach(name => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = name.Name;
        const baseUrl = window.location.protocol + "//" + window.location.host;
        const newUrl = `${baseUrl}/profile/player/${name.ID}`;
        console.log(newUrl)
        div.setAttribute('data-url', newUrl);

        div.addEventListener('click', function () {
            input.value = name.Name;
            suggestionsContainer.style.height = '0';
        });
        suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.style.height = height + 'px';
}

function load_skin() {
    const skinImg = document.getElementById("skin-img");
    skinImg.src = `https://vzge.me/full/${playerData.Name}`;
}

async function load_discord() {
    const apiUrl = `https://discordlookup.mesalytic.moe/v1/user/${playerData.DiscordID}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error while fetching discord data');
        }
        const data = await response.json();

        document.getElementById('discord-pfp').src = data.avatar.link;

        const username = data.global_name;

        if (username.length > 13) {
            document.getElementById('discord-username').textContent = username.substring(0, 13) + '...';
        } else {
            document.getElementById('discord-username').textContent = username;
        }
    } catch (error) {
        console.error('Error fetching Discord user data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (playerData !== null) {
        load_skin();
        load_discord();
    }

    input.addEventListener('input', function () {
        showSuggestions();
    });

    document.addEventListener('click', function (event) {
        if (!suggestionsContainer.contains(event.target) && event.target !== input && event.target !== magnifyingGlassIcon) {
            suggestionsContainer.style.height = '0';
        }
    });

    document.getElementById('discord-container').addEventListener('click', function() {
        window.location.href = `https://discord.com/users/${playerData.DiscordID}`;
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
