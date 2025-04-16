const fetchAvatar = async () => {
    console.log(discordId)
    try {
        const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${discordId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.avatar.link) {
            return data.avatar.link;
        } else {
            console.log(`Nenašiel sa avatar pre ${discordId}`);
        }
    } catch (error) {
        console.error(`Chyba pri získavaní dát pre ${discordId}:`, error);
    }
};

const setAvatar = async (discordId) => {
    const avatarUrl = await fetchAvatar(discordId);
    if (avatarUrl) {
        document.getElementById('avatar').src = avatarUrl;
    }
};

setAvatar(discordId);

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');

    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');

    document.querySelector(".switch-circle i").className = isLightMode ? "fas fa-sun" : "fas fa-moon";
}

(function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.querySelector(".switch-circle i").className = "fas fa-sun";
    }
})();
