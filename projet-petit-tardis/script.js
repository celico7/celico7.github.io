$(document).ready(function () {
    var mouseX, mouseY;
    var ww = $(window).width();
    var wh = $(window).height();
    var traX, traY;

    $(document).mousemove(function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        traX = ((4 * mouseX) / ww) + 40;  // Utiliser la largeur de la fenêtre
        traY = ((4 * mouseY) / wh) + 50;  // Utiliser la hauteur de la fenêtre

        // Mise à jour du background-position avec un espace entre les pourcentages
        $(".title").css({ "background-position": traX + "% " + traY + "%" });
    });
});





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





function updatePreview() {
    const username = document.getElementById('username').value.trim();
    const roleSelect = document.getElementById('role-select');
    const preview = document.getElementById('preview');

    // Vérifier si un pseudo est entré
    if (!username) {
        preview.textContent = 'Veuillez entrer un pseudo.';
        preview.style.color = 'red';
        preview.style.backgroundColor = 'transparent';
        return;
    }

    // Obtenir l'option sélectionnée
    const selectedOption = roleSelect.options[roleSelect.selectedIndex];

    // Mettre à jour l'aperçu avec le pseudo et la couleur
    preview.textContent = username;
    preview.style.color = selectedOption.style.backgroundColor;
}




let animationTimeout;
let chaosInterval;

function triggerAnimations() {
    const wordsContainer = document.querySelector('.words-container');
    const words = document.querySelectorAll('.word');

    // Étape 1 : Faire apparaître les mots (fadeIn via CSS)
    wordsContainer.style.opacity = '1';

    // Étape 2 : Ajouter un effet glitch temporaire
    setTimeout(() => {
        words.forEach((word) => word.classList.add('glitch'));
        setTimeout(() => {
            words.forEach((word) => word.classList.remove('glitch'));
        }, 1000);
    }, 1000); // Délai pour laisser le fadeIn se terminer

    // Étape 3 : Explosion chaotique
    setTimeout(() => {
        explodeWords();
        displayHackerBanner(); // Afficher la bannière
        startChaos(10); // Chaos pendant 10 secondes
    }, 2200);

    // Étape 4 : Écran noir à la fin
    setTimeout(() => {
        activateBlackout(); // Active l'écran noir
    }, 13000); // 10s de chaos + 3s supplémentaires pour finir

}

function activateBlackout() {
    const blackoutScreen = document.getElementById('blackout-screen');
    blackoutScreen.classList.remove('hidden');
    blackoutScreen.style.opacity = '1'; // Affiche l’écran noir

    // Retirer l’écran noir après 1 seconde
    setTimeout(() => {
        blackoutScreen.style.opacity = '0';
        setTimeout(() => {
            blackoutScreen.classList.add('hidden'); // Cache complètement après la transition
        }, 500); // Laisser le temps à la transition de se terminer
    }, 10000); // Garde l’écran noir visible pendant 1 seconde
}

function displayHackerBanner() {
    const hackerBanner = document.getElementById('hacker-banner');
    hackerBanner.classList.remove('hidden'); // Affiche la bannière

    // Retirer la bannière après 7 secondes
    setTimeout(() => {
        hackerBanner.classList.add('hidden');
    }, 7000);
}

function explodeWords() {
    const wordsContainer = document.querySelector('.words-container');
    const explosionContainer = document.getElementById('explosion-container');
    const words = document.querySelectorAll('.word');

    // Cacher les mots d'origine
    wordsContainer.style.display = 'none';

    // Créer des mots explosifs
    words.forEach((word) => {
        createChaoticWord(word.textContent, explosionContainer);
    });
}

function startChaos(durationInSeconds) {
    const explosionContainer = document.getElementById('explosion-container');
    const endTime = Date.now() + durationInSeconds * 1000;

    function addChaosWord() {
        if (Date.now() > endTime) {
            clearInterval(chaosInterval);
            return;
        }
        // Génère un mot aléatoire ou réutilise un mot existant
        const randomWords = ["Salon1", "Salon2", "Salon3", "Salon4", "Salon5",];
        const newWord = randomWords[Math.floor(Math.random() * randomWords.length)];

        // Crée un mot chaotique
        createChaoticWord(newWord, explosionContainer);
    }

    chaosInterval = setInterval(addChaosWord, 1); // Nouveaux mots toutes les 1s
}

function createChaoticWord(text, container) {
    const explodingWord = document.createElement('div');
    explodingWord.textContent = text;
    explodingWord.classList.add('word', 'exploding');

    // Positionner aléatoirement
    explodingWord.style.left = `${Math.random() * 100}vw`;
    explodingWord.style.top = `${Math.random() * 100}vh`;

    // Ajoute des variations de taille
    const randomSize = Math.random() * 2 + 0.5; // Entre 0.5 et 2.5 fois la taille normale
    explodingWord.style.fontSize = `${randomSize}rem`;

    container.appendChild(explodingWord);

    // Supprime le mot après l'animation
    explodingWord.addEventListener('animationend', () => {
        explodingWord.remove();
    });
}

