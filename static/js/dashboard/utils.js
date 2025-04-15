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
