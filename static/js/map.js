document.addEventListener("DOMContentLoaded", function() {
    loadData(1);
});

async function loadData() {
    const filePath = await loadMapImage(mapName);
    document.body.style.backgroundImage = `url(${filePath})`;

    // Show bg icon
    const eyeIcon = document.querySelector('.eye-icon');
    const content = document.querySelector('.content');
    const bgBlur = document.querySelector('#bg-blur');
    eyeIcon.addEventListener('mouseover', function() {
        content.style.opacity = '0';
        bgBlur.style.backdropFilter = 'none';
        bgBlur.style.backgroundColor = 'transparent';
    });

    eyeIcon.addEventListener('mouseout', function() {
        content.style.opacity = '1';
        // bgBlur.style.backdropFilter = 'blur(2px)';
        bgBlur.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
    });
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
victorsBox.style.maxHeight = buttonHeight+5 + 'px';

const sectionsBox = document.getElementById('table-box-sections');
sectionsBox.style.maxHeight = buttonHeight+5 + 'px';

document.querySelectorAll('.collapse').forEach(function(button) {
    button.addEventListener('click', function() {
        const tableBox = button.parentElement;
        const table = button.parentNode.querySelector(".table");

        const buttonHeight = getAbsoluteHeight(button);
        const tableHeight = getAbsoluteHeight(table);

        if (!tableBox.classList.contains("collapsed")) {
            tableBox.style.maxHeight = buttonHeight+5 + 'px';
            tableBox.classList.add("collapsed");
        } else {
            tableBox.style.maxHeight = buttonHeight+5 + tableHeight + 'px';
            tableBox.classList.remove("collapsed");
        }
    });
});