//------------- Fonctions utiles -------------

// Fonction générant des nombres pseudo-aléatoires entiers
// entre 0 et max (max non compris)
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// Fonction couleur aléatoire
function getRandomColor() {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}


export { getRandomInt, getRandomColor };
