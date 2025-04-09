const userDict = {
    "Phantastically": "422453107109396490",
    "Baleron420": "491234057015787543",
    "NateTheCrack": "648581579505139722",
    "Texyle": "269105396587823104",
    "wlatr": "189064061185556480",
    "A1GiJoe": "473987030339158036",
    "joejqd": "530123955445694504",
    "Treetop": "279746524488138755",
    "Udun": "765388393600909342",
    "Wolf": "213220359120355329",
    "aeiou": "690212145937383451",
    "chromaticfire": "712160294285082705",
    "Deciron": "318036877133217792",
    "Derek46": "338786998544498699",
    "EpikMineWay": "540505831116898305",
    "ettc": "695468387924574231",
    "ImChill1n": "1073146518481162240",
    "Izaac": "381505087115100160",
    "Lemon": "408971271087456265",
    "BramVeen": "336148116216741889"
};

const fetchAvatar = async (name, userId) => {
    try {
        const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const img = document.querySelector(`img[alt="${name}"]`);
        if (img && data.avatar && data.avatar.link) {
            img.src = data.avatar.link;
            console.log(`Aktualizovaný avatar pre ${name} na ${data.avatar.link}`);
        } else {
            console.log(`Nenašiel sa avatar pre ${name}`);
        }
    } catch (error) {
        console.error(`Chyba pri získavaní dát pre ${name}:`, error);
    }
};

const updateAvatars = async () => {
    const promises = Object.entries(userDict).map(([name, userId]) => fetchAvatar(name, userId));
    await Promise.all(promises);
};

document.addEventListener('DOMContentLoaded', updateAvatars);