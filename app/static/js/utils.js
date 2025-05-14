// async function loadMapImage(mapName) {
//     const baseFileName = mapName.replace(/[\W\s]/g, '').toLowerCase();
//     const pngFileName = `${baseFileName}.png`;
//     const jpgFileName = `${baseFileName}.jpg`;

//     return new Promise((resolve, reject) => {
//         const img = new Image();

//         img.onload = function() {
//             resolve(`/static/images/maps/${pngFileName}`);
//         };

//         img.onerror = function() {
//             const jpgImg = new Image();
//             jpgImg.onload = function() {
//                 resolve(`/static/images/maps/${jpgFileName}`);
//             };
//             jpgImg.onerror = function() {
//                 reject(new Error(`Image not found: ${mapName}`));
//             };
//             jpgImg.src = `/static/images/maps/${jpgFileName}`;
//         };

//         img.src = `/static/images/maps/${pngFileName}`;
//     });
// }

async function loadMapImage(mapName) {
    fetch(`/mapImage/${mapName}`)
        .then(response => response.json())
        .then(data => {
            const img = new Image();

            img.onload = function() {
                resolve(`/static/${data.image_url}`);
            };

            const path = `/static/${data.image_url}`;
            img.src = path;

            img.onerror = function () {
                console.error("Error loading image:", path);
            };
        })
            .catch(error => {
                console.error("Error fetching background image:", error);
        });
}

// window.Utils = {
//     loadMapImage
// };
