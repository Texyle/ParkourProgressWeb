document.addEventListener('DOMContentLoaded', function () {
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
        const matchingNames = findBestMatches(playerNames, query);

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
            console.log(newUrl);
            div.setAttribute('data-url', newUrl);

            div.addEventListener('click', function () {
                input.value = name.Name;
                suggestionsContainer.style.height = '0';
            });
            suggestionsContainer.appendChild(div);
        });

        suggestionsContainer.style.height = height + 'px';
    }

    async function load_skin() {
        const skinImg = document.getElementById("skin-img");
        const url = `https://vzge.me/full/512/${playerData.Name}`;
        const fallbackUrl = 'https://vzge.me/full/512/X-Steve';
    
        try {
            const response = await fetch(url);
            if (response.status === 404) {
                skinImg.src = fallbackUrl;
            } else {
                skinImg.src = url;
            }
        } catch (error) {
            console.error('Error loading image:', error);
            skinImg.src = fallbackUrl;
        }
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

    if (typeof playerData !== 'undefined') {
        load_skin();
        load_discord();

        document.getElementById('discord-container').addEventListener('click', function() {
            window.location.href = `https://discord.com/users/${playerData.DiscordID}`;
        });
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
            dropdownButton.classList.add('gamemode-dropdown-changed');
            dropdownButton.textContent = 'Gamemodes *';
        } else {
            dropdownButton.classList.remove('gamemode-dropdown-changed');
            dropdownButton.textContent = 'Gamemodes';
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
});

function selectOption(event, option) {
    event.stopPropagation();
    console.log("Selected option: " + option);

    var dropdownContent = event.target.parentElement;
    var dropdownButton = dropdownContent.previousElementSibling;

    dropdownButton.textContent = "Sort by: " + option;
}

function redirectToCountryPage(countryCode) {
    const baseUrl = window.location.protocol + "//" + window.location.host;
    const newUrl = `${baseUrl}/profile/country/${countryCode}`;

    window.location.href = newUrl;
}