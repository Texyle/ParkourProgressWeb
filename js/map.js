document.addEventListener("DOMContentLoaded", function() {
    loadData("Pandora's Box");
});

async function loadData(name) {
    response = await fetch("/load_map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    });

    const map = await response.json();

    console.log(map.ScreenshotURL);
    document.body.style.backgroundImage = `url(${map.ScreenshotURL})`;
}

function getAbsoluteHeight(el) {
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
  
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);
  
    return Math.ceil(el.offsetHeight + margin);
  }

const collapseButton = document.getElementById('collapse-victors');
const buttonHeight = getAbsoluteHeight(collapseButton);

const victorsBox = document.getElementById('table-box-victors');
victorsBox.style.maxHeight = buttonHeight + 'px';

const sectionsBox = document.getElementById('table-box-sections');
sectionsBox.style.maxHeight = buttonHeight + 'px';

document.querySelectorAll('.collapse').forEach(function(button) {
    button.addEventListener('click', function() {
        const tableBox = button.parentElement;
        const table = button.parentNode.querySelector(".table");

        const buttonHeight = getAbsoluteHeight(button);
        const tableHeight = getAbsoluteHeight(table);

        if (!tableBox.classList.contains("collapsed")) {
            tableBox.style.maxHeight = buttonHeight + 'px';
            tableBox.classList.add("collapsed");
        } else {
            tableBox.style.maxHeight = buttonHeight + tableHeight + 'px';
            tableBox.classList.remove("collapsed");
        }
    });
});


  tableBox.style.maxHeight = buttonHeight + 'px';