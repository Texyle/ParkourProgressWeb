document.addEventListener("DOMContentLoaded", function () {
    let currentPath = window.location.pathname;
    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});

