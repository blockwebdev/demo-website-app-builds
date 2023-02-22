async function getInscription(inscription_id) {
    try {
      const inscriptionsElement = document.getElementById("inscriptions");
      inscriptionsElement.innerHTML = "";
      showSpinner(inscriptionsElement);
      const response = await fetch(`https://ordapi.xyz/inscription/${inscription_id}`);
      const data = await response.json();
      const imageSrc = `https://ordapi.xyz/content/${inscription_id}`;
      const previewResponse = await fetch(imageSrc);
      const blob = await previewResponse.blob();
      const url = URL.createObjectURL(blob);
      displayInscription(data, url, inscriptionsElement);
      inscriptionsElement.removeChild(inscriptionsElement.firstChild);
    } catch (error) {
      console.log("Error fetching inscription:", error);
    }
}
  
async function getInscriptionsByAddress(address) {
    try {
      const inscriptionsElement = document.getElementById("inscriptions");
      inscriptionsElement.innerHTML = "";
      showSpinner(inscriptionsElement);
      const response = await fetch(`https://ordapi.xyz/address/${address}`);
      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        const inscriptionResponse = await fetch(`https://ordapi.xyz/inscription/${data[i].id}`);
        const inscriptionData = await inscriptionResponse.json();
        const imageSrc = `https://ordapi.xyz/content/${data[i].id}`;
        const previewResponse = await fetch(imageSrc);
        const blob = await previewResponse.blob();
        const url = URL.createObjectURL(blob);
        displayInscription(inscriptionData, url, inscriptionsElement);
      }
      inscriptionsElement.removeChild(inscriptionsElement.firstChild);
    } catch (error) {
      console.log("Error fetching inscriptions:", error);
    }
}

function showSpinner(spinner) {
    let spinnerElement = document.createElement("div");
    spinnerElement.className = "spinner";
    spinnerElement.innerHTML = '<img src="https://media.giphy.com/media/131tNuGktpXGhy/giphy.gif">';
    spinner.appendChild(spinnerElement);
}

function displayInscription(inscription, imageSrc, inscriptionsElement) {
    // create inscription element
    let inscriptionElement = document.createElement("div");
    inscriptionElement.className = "inscription";
  
    // display inscription element
    let titleElement = document.createElement("h2");
    titleElement.textContent = `${inscription.title}`;
    inscriptionElement.appendChild(titleElement);
  
    // create and display timestamp
    let timestampElement = document.createElement("p");
    let timestamp = new Date(inscription.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    timestampElement.textContent = `CREATED: ${timestamp}`;
    timestampElement.style.fontWeight = "bold";
    timestampElement.style.color = "red";
    inscriptionElement.appendChild(timestampElement);
  
    // create and display owner address
    let ownerElement = document.createElement("p");
    ownerElement.innerHTML = `OWNER ADDRESS: <a href="https://www.blockchain.com/btc/address/${inscription.address}" target="_blank">${inscription.address}</a>`;
    ownerElement.style.fontWeight = "bold";
    ownerElement.style.color = "blue";
    inscriptionElement.appendChild(ownerElement);

    // create and display image element
    let imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.width = 360;
    imageElement.height = 360;
    
    inscriptionElement.appendChild(imageElement);
  
    // add inscription element to the page
    inscriptionsElement.appendChild(inscriptionElement);
}
  
document.getElementById("search-button").addEventListener("click", function () {
    let inscription_id = document.getElementById("search-box").value;
    getInscription(inscription_id);
});
  
document.getElementById("search-button2").addEventListener("click", function () {
    let address = document.getElementById("search-box2").value;
    getInscriptionsByAddress(address);
});


