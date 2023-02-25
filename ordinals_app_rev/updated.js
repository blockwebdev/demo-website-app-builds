// Handles both the ID and Number lookup
async function getInscription(inscription) {
    const inscriptionsElement = document.getElementById("inscriptions");
    inscriptionsElement.innerHTML = "";
    
    if (/^[a-zA-Z]+$/.test(inscription)) {
        window.alert("Please enter a valid inscription number.");
        return;
    }
    showSpinner(inscriptionsElement);
  
    try {
      let data, url;
  
      if (isNaN(inscription)) {
        const response = await fetch(`https://ordapi.xyz/inscription/${inscription}`);
        data = await response.json();
        url = `https://ordapi.xyz/content/${inscription}`;
      } else {
        const response = await fetch(`https://ordapi.xyz/inscriptions/?start=${inscription}&end=${inscription}&limit=1`);
        const inscriptions = await response.json();
        if (inscriptions.length === 0) {
          window.alert("No inscription found with inscription number:", inscription);
          inscriptionsElement.removeChild(inscriptionsElement.firstChild);
          return;
        }
        const inscription_id = inscriptions[0].id;
        const inscriptionResponse = await fetch(`https://ordapi.xyz/inscription/${inscription_id}`);
        data = await inscriptionResponse.json();
        url = `https://ordapi.xyz/content/${inscription_id}`;
      }
  
      const previewResponse = await fetch(url);
      const blob = await previewResponse.blob();
      const imageUrl = URL.createObjectURL(blob);
  
      displayInscription(data, imageUrl, inscriptionsElement);

    } catch (error) {
      window.alert("Failed getting 'Inscription Number', try again later.", error);
    } finally {
      inscriptionsElement.removeChild(inscriptionsElement.firstChild);
    }
}

// Handles just the Bitcoin address lookup
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

// create div and fetch latest inscription
const numbersDiv = document.getElementById("numbers");

fetch('https://ordapi.xyz/feed')
  .then(response => response.json())
  .then(data => {
    const mostRecent = data.rss.channel.item[0].title;
    numbersDiv.textContent = mostRecent;
  })
  .catch(error => console.error(error));


// Loading image 
function showSpinner(spinner) {
    let spinnerElement = document.createElement("div");
    spinnerElement.className = "spinner";
    spinnerElement.innerHTML = '<img src="https://media.giphy.com/media/131tNuGktpXGhy/giphy.gif">';
    spinner.appendChild(spinnerElement);
}

// Display all relevant info pertaining to whichever lookup
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

document.getElementById("search-button2").addEventListener("click", function () {
  let address = document.getElementById("search-box2").value;
  getInscriptionsByAddress(address);
});

document.getElementById("search-box2").addEventListener("keypress", function (event) {
  if (event.keyCode === 13) { // 13 is the key code for the "Enter" key
    event.preventDefault(); // prevent default form submission behavior
    document.getElementById("search-button2").click(); // manually trigger the "click" event on the button
  }
});

document.getElementById("search-button").addEventListener("click", function () {
  let inscription_id = document.getElementById("search-box").value;
  getInscription(inscription_id);
});

document.getElementById("search-box").addEventListener("keypress", function (event) {
  if (event.keyCode === 13) { // 13 is the key code for the "Enter" key
    event.preventDefault(); // prevent default form submission behavior
    document.getElementById("search-button").click(); // manually trigger the "click" event on the button
  }
});

