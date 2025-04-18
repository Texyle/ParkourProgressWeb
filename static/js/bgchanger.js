const interval = 20000;

document.addEventListener("DOMContentLoaded", function () {
    function changeBackground() {
        fetch("/random-image")
            .then(response => response.json())
            .then(data => {
                const img = new Image();
                img.src = data.image_url;

                img.onload = function () {
                    document.body.style.transition = "background-image 1.5s ease-in-out";
                    document.body.style.backgroundImage = `url('${data.image_url}')`;

                    setTimeout(changeBackground, interval);
                };

                img.onerror = function () {
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