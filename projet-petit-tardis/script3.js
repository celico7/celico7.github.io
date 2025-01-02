function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });

    // Show the selected section
    var selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
};

    
    

        // Cible les éléments HTML
var slider = document.getElementById("myRange");
var dateDisplay = document.getElementById("dateDisplay");
var eventDisplay = document.getElementById("eventDisplay");

// Charge le fichier JSON
fetch('events.json')
  .then(response => response.json())
  .then(data => {
    events = data; // Stocke les événements dans la variable globale

    // Ajoute un écouteur pour mettre à jour l'affichage en fonction de la valeur du slider
    slider.addEventListener("input", function() {
      let eventIndex = slider.value;
      if (events[eventIndex]) {
        dateDisplay.textContent = events[eventIndex].date;
        eventDisplay.textContent = events[eventIndex].event;
      } else {
        dateDisplay.textContent = "Date non définie";
        eventDisplay.textContent = "Aucun événement";
      }
    });
  })
  .catch(error => console.error("Erreur de chargement des événements :", error));

// Fonction pour obtenir un événement aléatoire
function getRandomEvent() {
  if (events.length > 0) {
    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex]; // Retourne un objet événement aléatoire
  } else {
    return null; // Si aucun événement n'est chargé
  }
}

// Génère un événement aléatoire lors du clic sur le bouton
document.getElementById("generateButton").onclick = function() {
  const randomEvent = getRandomEvent();
  if (randomEvent) {
    // Mets à jour le slider pour correspondre à l'événement généré
    const randomIndex = events.indexOf(randomEvent);
    slider.value = randomIndex;

    // Mets à jour l'affichage de la date et de l'événement
    dateDisplay.textContent = `Date: ${randomEvent.date}`;
    eventDisplay.textContent = `Event: ${randomEvent.event}`;
  } else {
    console.error("Aucun événement disponible.");
  }
};