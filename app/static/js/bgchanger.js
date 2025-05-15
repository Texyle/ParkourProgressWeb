const interval = 20000;
let isCooldown = false;
let changeTimeout = null;

document.addEventListener("DOMContentLoaded", function () {
    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    function changeBackground() {
        isCooldown = true;
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

                    setTimeout(() => {
                        isCooldown = false;
                    }, 1500);

                    clearTimeout(changeTimeout);
                    changeTimeout = setTimeout(changeBackground, interval);
                };

                img.onerror = function () {
                    console.error("Error loading image:", path);
                    setTimeout(() => {
                        isCooldown = false;
                    }, 500);
                    clearTimeout(changeTimeout);
                    changeTimeout = setTimeout(changeBackground, interval);
                };
            })
            .catch(error => {
                console.error("Error fetching background image:", error);
                setTimeout(() => {
                    isCooldown = false;
                }, 500);
                clearTimeout(changeTimeout);
                changeTimeout = setTimeout(changeBackground, interval);
            });
    }

    changeTimeout = setTimeout(changeBackground, interval);

    document.body.addEventListener("click", function (e) {
        console.log(e.target);
        if (e.target.classList.contains("eye-icon") && !isCooldown) {
            changeBackground();
        }
    });
});