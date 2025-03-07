async function loadMapImage(mapName) {
  const baseFileName = mapName.replace(/[\W\s]/g, '').toLowerCase();
  const pngFileName = `${baseFileName}.png`;
  const jpgFileName = `${baseFileName}.jpg`;

  return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = function() {
          resolve(`/static/images/maps/${pngFileName}`);
      };

      img.onerror = function() {
          const jpgImg = new Image();
          jpgImg.onload = function() {
              resolve(`/static/images/maps/${jpgFileName}`);
          };
          jpgImg.onerror = function() {
              reject(new Error('Neither PNG nor JPG file exists'));
          };
          jpgImg.src = `/static/images/maps/${jpgFileName}`;
      };

      img.src = `/static/images/maps/${pngFileName}`;
  });
}

window.Utils = {
  loadMapImage
};