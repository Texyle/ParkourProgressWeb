document.addEventListener("DOMContentLoaded", function () {
    let baseTitle = document.title;
    let speed = 200;
    let index = 0;

    let extendedTitle = " - " + baseTitle + " ";

    function scrollTitle() {
        document.title = extendedTitle.substring(index) + extendedTitle.substring(0, index);
        index = (index + 1) % extendedTitle.length;
        setTimeout(scrollTitle, speed);
    }
    
    if (document.title != "Dashboard" && "Authorization") {
        scrollTitle();
    }
});
