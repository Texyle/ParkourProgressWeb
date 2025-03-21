const title = document.title;
let spaces = "";

function moveTitle() {
    spaces = spaces.length < 30 ? spaces + " " : "";
    document.title = spaces + title;
}

setInterval(moveTitle, 200);