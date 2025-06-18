var progressTab = new ProgressTab();

document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.getElementById('tabs').querySelectorAll("li");
    tabButtons.forEach(item => {
      item.addEventListener("click", function(event) {
        selectTab(event.target);
      });
    });

    progressTab.init();
});

function selectTab(tab) {
    const tabName = tab.getAttribute("data-tab");

    switchTab(tabName);
    switchSidebar(tab);
}

function switchTab(tabName) {
    let currentTab, newTab;
    let currentTabIndex, newTabIndex, i = 0;

    document.querySelectorAll(".tab").forEach(item => {
        if (item.classList.contains("selected")) {
            currentTab = item;
            currentTabIndex = i;
        }

        const contentName = item.getAttribute("data-tab");
        if (contentName === tabName) {
            newTab = item;
            newTabIndex = i;
        }
        i++;
    });

    if (currentTab == newTab) {
        return;
    }

    let transformCurrent, transformNew;
    if (currentTabIndex > newTabIndex) {
        transformCurrent = "110%";
        transformNew = "-110%";
    } else {
        transformCurrent = "-110%";
        transformNew = "110%";
    }

    currentTab.style.transform = `translateX(${transformCurrent})`;

    newTab.style.transition = "none";
    newTab.style.transform = `translateX(${transformNew})`;
    void newTab.offsetWidth;
    newTab.style.transition = "";

    newTab.style.transform = "translateX(0)";

    newTab.classList.add("selected");
    currentTab.classList.remove("selected");
}

function switchSidebar(tab) {
    document.getElementById("tabs").querySelectorAll("li").forEach(item => {
        item.classList.remove("selected");
    });

    tab.classList.add("selected");
}