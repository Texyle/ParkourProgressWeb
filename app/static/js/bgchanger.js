const interval = 20000;
let cachedImages = [];

document.addEventListener("DOMContentLoaded", function () {
    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    function changeBackground() {
        fetch("/randomImage")
            .then(response => response.json())
            .then(data => {
                const img = new Image();
                const path = `/static/${data.image_url}`;
                img.src = path;

                img.onload = function () {
                    document.body.style.transition = "background-image 1.5s ease-in-out";
                    document.body.style.backgroundImage = `url('${path}')`;

                    preloadImage(path);

                    setTimeout(changeBackground, interval);
                };

                img.onerror = function () {
                    console.error("Error loading image:", path);
                    setTimeout(changeBackground, interval);
                };
            })
            .catch(error => {
                console.error("Error fetching background image:", error);
                setTimeout(changeBackground, interval);
            });
    }

    setTimeout(changeBackground, interval);
});