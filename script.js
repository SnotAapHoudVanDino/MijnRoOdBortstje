// Firebase-configuratie (voeg jouw Firebase gegevens hier in)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const storage = firebase.storage(app);

document.addEventListener("DOMContentLoaded", function () {
  alert("Ik hou van jou Robin ❤️");
});

// Functie om toegangscode te controleren
function checkCode() {
  let code = document.getElementById("accessCode").value;
  if (code === "28/08/2024") {
    document.getElementById("login").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    alert("Foutieve code! Probeer opnieuw.");
  }
}

// Functie om foto’s en video's te tonen
function toonFotosVideos() {
  document.getElementById("content").innerHTML = `
    <h2>Foto’s en Video’s</h2>
    <p>Kies een categorie:</p>
    <button onclick="toonGebeurtenissen('Zomervakanties')">Zomervakanties</button>
    <button onclick="toonGebeurtenissen('Kerstvakanties')">Kerstvakanties</button>
    <button onclick="toonGebeurtenissen('Op reis')">Op reis</button>
    <button onclick="toonGebeurtenissen('Uitstappen')">Uitstappen</button>
    <button onclick="toonGebeurtenissen('Zomaar jij en ik')">Zomaar jij en ik</button>
    <div id="gebeurtenissen"></div>
  `;
}

// Functie om gebeurtenissen in een categorie te tonen
function toonGebeurtenissen(categorie) {
  let gebeurtenissen = {
    "Zomervakanties": ["Zomervakantie"],
    "Kerstvakanties": ["Kerstvakantie"],
    "Op reis": ["Weekend Parijs", "Italië Trip"],
    "Uitstappen": ["Dierentuin", "Pretpark"],
    "Zomaar jij en ik": ["Samen koken", "Romantische avond"],
  };

  let html = `<h3>${categorie}</h3>`;
  gebeurtenissen[categorie].forEach(event => {
    html += `<button onclick="toonFotos('${categorie}', '${event}')">${event}</button>`;
  });
  document.getElementById("gebeurtenissen").innerHTML = html;
}

// Functie om foto's van een gebeurtenis te tonen
function toonFotos(categorie, event) {
  let fotos = [];
  let html = `
    <h3>Foto's van ${event}</h3>
    <input type="file" id="fileUpload" multiple accept="image/*">
    <button onclick="uploadFotos('${categorie}', '${event}')">Upload Foto's</button>
    <div class="foto-container" id="fotoGalerij"></div>
  `;
  document.getElementById("gebeurtenissen").innerHTML = html;
  laadFotos(categorie, event);
}

// Functie om foto's van Firebase op te halen
function laadFotos(categorie, event) {
  const storageRef = storage.ref();
  const fotosRef = storageRef.child(`${categorie}/${event}`);

  fotosRef.listAll().then(result => {
    let html = '';
    result.items.forEach(fileRef => {
      fileRef.getDownloadURL().then(url => {
        html += `<img src="${url}" alt="${fileRef.name}" />`;
        document.getElementById('fotoGalerij').innerHTML = html;
      });
    });
  });
}

// Functie om foto's naar Firebase te uploaden
function uploadFotos(categorie, event) {
  const fileInput = document.getElementById('fileUpload');
  const files = fileInput.files;
  const storageRef = storage.ref();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileRef = storageRef.child(`${categorie}/${event}/${file.name}`);
    
    fileRef.put(file).then(snapshot => {
      console.log('Foto geüpload!');
      laadFotos(categorie, event);
    });
  }
}

// Functie voor het dagboek
function toonDagboek() {
  document.getElementById("content").innerHTML = `
    <h2>Dagboek</h2>
    <textarea id="dagboekInput" rows="4" cols="50" placeholder="Schrijf hier je bericht..."></textarea><br>
    <button onclick="opslaanDagboek()">Opslaan</button>
    <div id="dagboekEntries"></div>
  `;
  laadDagboek();
}

// Functie om een bericht in het dagboek op te slaan
function opslaanDagboek() {
  const tekst = document.getElementById('dagboekInput').value;
  const datum = new Date().toLocaleString();

  if (tekst.trim() === "") {
    alert("Het bericht mag niet leeg zijn.");
    return;
  }

  db.collection('dagboek').add({
    datum: datum,
    tekst: tekst
  }).then(() => {
    laadDagboek();
  });
}

// Functie om het dagboek op te halen
function laadDagboek() {
  db.collection('dagboek').get().then(querySnapshot => {
    let html = '';
    querySnapshot.forEach(doc => {
      const data = doc.data();
      html += `<div><strong>${data.datum}</strong><p>${data.tekst}</p></div>`;
    });
    document.getElementById('dagboekEntries').innerHTML = html;
  });
}