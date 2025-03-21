document.addEventListener("DOMContentLoaded", function () {
    function changeBackground() {
        fetch("/random-image")
            .then(response => response.json())
            .then(data => {
                if (data.image_url) {
                    document.body.style.transition = "background-image 1.5s ease-in-out";
                    document.body.style.backgroundImage = `url('${data.image_url}')`;
                }
            })
            .catch(error => console.error("Error fetching image:", error));
    }

    setTimeout(() => {
        changeBackground();
        setInterval(changeBackground, 20000);
    }, 20000); 
});
