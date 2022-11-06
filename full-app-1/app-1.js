function openTab(platformName, element, color) {

    let i, tabContent, tabLinks;

    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tabLink");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].style.backgroundColor = "";
    }

    document.getElementById(platformName).style.display = "block";

    element.style.backgroundColor = color;


}

document.getElementById("defaultOpen").click();