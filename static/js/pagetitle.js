document.addEventListener("DOMContentLoaded", function () {
    let baseTitle = document.title;
    let parts = baseTitle.split(" - "); 
    let mainPart = parts[0]; 
    let suffix = " - " + parts.slice(1).join(" - "); 
    let speed = 200;  
    let index = 0;

    function scrollTitle() {
        document.title = mainPart.substring(index) + " " + mainPart.substring(0, index) + suffix;
        index = (index + 1) % mainPart.length;
        setTimeout(scrollTitle, speed);
    }

    scrollTitle();
});
