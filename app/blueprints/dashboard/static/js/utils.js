const fetchAvatar = async () => {
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

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function isImageUrl(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

function extractDomainName(url) {
    try {
        const domain = new URL(url).hostname;
        const domainWithoutWww = domain.replace(/^www\./, '');
        const domainParts = domainWithoutWww.split('.');
        const domainName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
        return domainName;
    } catch (e) {
        console.error("Invalid URL:", e);
        return null;
    }
}