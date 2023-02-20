async function getInscription(inscription_id) {
    try {
        const response = await fetch(`https://ordapi.xyz/inscription/${inscription_id}`);
        const data = await response.json();
        const imageSrc = `https://ordapi.xyz/content/${inscription_id}`;
        const previewResponse = await fetch(imageSrc);
        const blob = await previewResponse.blob();
        const url = URL.createObjectURL(blob);
        displayInscription(data, url);
    } catch (error) {
        console.log("Error fetching inscription:", error);
    }
}

async function getInscriptionsByAddress(address) {
    try {
        const response = await fetch(`https://ordapi.xyz/address/${address}`);
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            const inscriptionResponse = await fetch(`https://ordapi.xyz/inscription/${data[i].id}`);
            const inscriptionData = await inscriptionResponse.json();
            const imageSrc = `https://ordapi.xyz/content/${data[i].id}`;
            const previewResponse = await fetch(imageSrc);
            const blob = await previewResponse.blob();
            const url = URL.createObjectURL(blob);
            displayInscription(inscriptionData, url);
        }
    } catch (error) {
        console.log("Error fetching inscriptions:", error);
    }
}


function displayInscription(inscription, imageSrc) {
    // remove previous search results
    var inscriptionsElement = document.getElementById("inscriptions");
    inscriptionsElement.innerHTML = "";

    // create inscription element
    var inscriptionElement = document.createElement("div");
    inscriptionElement.className = "inscription";

    // display inscription element
    var titleElement = document.createElement("h2");
    titleElement.textContent = `${inscription.title}`;
    inscriptionElement.appendChild(titleElement);

    // create and display timestamp
    var timestampElement = document.createElement("p");
    var timestamp = new Date(inscription.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    timestampElement.textContent = `CREATED: ${timestamp}`;
    timestampElement.style.fontWeight = "bold";
    inscriptionElement.appendChild(timestampElement);

    // create and display owner address
    var ownerElement = document.createElement("p");
    ownerElement.textContent = `OWNER ADDRESS: ${inscription.address}`;
    ownerElement.style.fontWeight = "bold";
    inscriptionElement.appendChild(ownerElement);

    // create and display image element
    var imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.width = 360;
    imageElement.height = 360;
    inscriptionElement.appendChild(imageElement);

    // add inscription element to the page
    inscriptionsElement.appendChild(inscriptionElement);
}

document
    .getElementById("search-button")
    .addEventListener("click", function () {
    var inscription_id = document.getElementById("search-box").value;
    getInscription(inscription_id);
    });

document
    .getElementById("search-button2")
    .addEventListener("click", function () {
    var address = document.getElementById("search-box2").value;
    getInscriptionsByAddress(address);
    }); 

// create link element
var twitterLink = document.createElement("a");
twitterLink.textContent = "Created by @blockwebdev";
twitterLink.href = "https://twitter.com/blockwebdev";
twitterLink.target = "_blank";

// style link element
twitterLink.style.position = "fixed";
twitterLink.style.bottom = "10px";
twitterLink.style.right = "10px";

// add link element to the page
document.body.appendChild(twitterLink);





