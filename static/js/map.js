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

// if (sectionsBox) {
//   sectionsBox.style.maxHeight = buttonHeight + 5 + 'px';
// } else {
//   const marginBottom = parseFloat(window.getComputedStyle(collapseButton).marginBottom);
//   victorsBox.style.maxHeight = buttonHeight + marginBottom + 10 + 'px'; 
//   console.warn("Element 'table-box-sections' neexistuje, nastavujeme vysku podla marginu tlacidla 'Victors'.");
// }

setBoxHeight(victorsBox);
if (sectionsBox) {
  setBoxHeight(sectionsBox);
}

function setBoxHeight(box) {
  const button = box.querySelector("button")
  const table = box.querySelector(".table")

  const buttonHeight = getAbsoluteHeight(button);
  const tableHeight = getAbsoluteHeight(table);

  if (box.classList.contains("collapsed")) {
    box.style.maxHeight = buttonHeight+5 + 'px';
  } else {
    box.style.maxHeight = buttonHeight+5 + tableHeight + 'px';
  }
}

document.querySelectorAll('.collapse').forEach(function(button) {
    button.addEventListener('click', function() {
        const tableBox = button.parentElement;

        if (!tableBox.classList.contains("collapsed")) {
          tableBox.classList.add("collapsed");
        } else {
          tableBox.classList.remove("collapsed");
        }
      setBoxHeight(tableBox);
    });
});

document.querySelectorAll(".country-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.stopPropagation(); 
    const href = link.dataset.href;
    if (href) {
      window.location.href = href;
    }
  });
});

document.querySelectorAll(".player-row").forEach(row => {
  row.addEventListener("click", () => {
    const href = row.dataset.href;
    if (href) {
      window.location.href = href;
    }
  });
});

function getTotalHeightWithChildren(el) {
  el = (typeof el === 'string') ? document.querySelector(el) : el;

  if (!el) {
      console.error("Element not found");
      return 0;
  }

  let totalHeight = 0;
  const children = el.children;

  for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const styles = window.getComputedStyle(child);
      const marginTop = parseFloat(styles['marginTop']) || 0;
      const marginBottom = parseFloat(styles['marginBottom']) || 0;
      const margin = marginTop + marginBottom;

      totalHeight += child.offsetHeight + margin;
  }

  const ulStyles = window.getComputedStyle(el);
  const ulMarginTop = parseFloat(ulStyles['marginTop']) || 0;
  const ulMarginBottom = parseFloat(ulStyles['marginBottom']) || 0;
  const ulPaddingTop = parseFloat(ulStyles['paddingTop']) || 0;
  const ulPaddingBottom = parseFloat(ulStyles['paddingBottom']) || 0;

  totalHeight += ulMarginTop + ulMarginBottom + ulPaddingTop + ulPaddingBottom;

  return totalHeight;
}

document.addEventListener("DOMContentLoaded", function() {
    const sectionItems = document.querySelectorAll('.section-item');

    sectionItems.forEach(item => {
      const header = item.querySelector('.section-header');
      const list = item.querySelector('.list-section-players');

      header.addEventListener('click', () => {
    //     item.classList.toggle('open');
    //     if (item.classList.contains('open')) {
    //       list.style.display = 'block';  
    //     } else {
    //       list.style.display = 'none';   
    //     }
    //   });

        const listHeight = getTotalHeightWithChildren(list);
        console.log(listHeight);

        if (!list.classList.contains("collapsed")) {
          list.style.maxHeight = 0;
          list.classList.add("collapsed");
        } else {
          list.style.maxHeight = listHeight + 'px';
          list.classList.remove("collapsed");

          const sectionsBox = document.getElementById('table-box-sections');
          sectionsBox.style.maxHeight = '100rem';
          setTimeout(function() {
            setBoxHeight(sectionsBox);
        }, 300);
        }
      });
    });
});

const players = {};
    
function onYouTubeIframeAPIReady() {
  const container = document.getElementById('video-player');
  const videoId = container.dataset.videoid;
    
  players['video-player'] = new YT.Player('video-player', {
    videoId: videoId,
    events: {
      'onReady': function (event) {
        console.log("yes it works");

        const iframe = event.target.getIframe();
        if (iframe) {
          iframe.style.borderRadius = "3px";
          iframe.style.border = "3px solid gray";
          iframe.style.boxShadow = "0px 0px 10px 2px gray inset";
          iframe.style.width = "560px";
          iframe.style.height = "315px";
          console.log(iframe);
        }
      },
      'onError': function (event) {
        if ([100, 101, 150].includes(event.data)) {
          const contdiv = document.querySelector(".container");
          contdiv.style.display = "none";
        }
      }
    }
  });
}

async function changeTitle() {
  document.title = mapName + " - Parkour Progress";
}

document.addEventListener("DOMContentLoaded", changeTitle)
