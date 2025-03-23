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

        // const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${data.avatar}.png`;
        document.getElementById('discord-pfp').src = data.avatar.link;
        document.getElementById('discord-username').textContent = data.global_name;
    } catch (error) {
        console.error('Error fetching Discord user data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    load_skin();
    load_discord();

    input.addEventListener('input', function () {
        showSuggestions();
    });

    document.addEventListener('click', function (event) {
        if (!dropdownContainer.contains(event.target) && event.target !== input && event.target !== magnifyingGlassIcon) {
            dropdownContainer.style.height = '0';
        }
    });

    document.getElementById('discord-container').addEventListener('click', function() {
        window.location.href = 'https://www.example.com';
    });

    input.addEventListener('click', function () {
        showSuggestions();
    });
});
