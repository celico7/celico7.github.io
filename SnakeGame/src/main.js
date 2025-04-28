import "./style.css";
import { getRandomInt, getRandomColor } from "./utils.js";

const canvas = document.getElementById("terrain");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 20; // Taille d'une cellule
const GRID_SIZE = canvas.width / CELL_SIZE; // Nombre de cellules en largeur et hauteur

const scoreDisplay = document.getElementById("score");
let score = 0;

let vitesse = 300; // durée en millisecondes, vitesse de départ

let gameStarted = false; // Indique si la partie est en cours
let gameOver = false; // Indique si la partie est terminée
let gameWon = false; // Indique si la partie est gagnée

// Fonction pour générer une direction aléatoire
function getRandomDirection() {
    return Math.floor(Math.random() * 4); // Retourne un nombre entre 0 et 3
}

// Classe Terrain
class Terrain {
    constructor(largeur, hauteur) {
        this.largeur = largeur;
        this.hauteur = hauteur;
        this.grille = Array.from({ length: hauteur }, () => Array(largeur).fill(0)); // 0 = cellule vide
    }

    // Ajoute un obstacle à une position donnée
    ajouterObstacle(i, j) {
        if (this.estDansLimites(i, j)) {
            this.grille[j][i] = 1; // 1 = obstacle
        }
    }

    // Vérifie si une cellule est un obstacle
    estObstacle(i, j) {
        return this.estDansLimites(i, j) && this.grille[j][i] === 1;
    }

    // Vérifie si une position est dans les limites du terrain
    estDansLimites(i, j) {
        return i >= 0 && i < this.largeur && j >= 0 && j < this.hauteur;
    }

    // Dessine le terrain avec les obstacles
    draw() {
        for (let j = 0; j < this.hauteur; j++) {
            for (let i = 0; i < this.largeur; i++) {
                if (this.grille[j][i] === 1) {
                    // Style mur 
                    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--mur-couleur");
                    ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
                    // Petit contour noir
                    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--mur-contour");;
                    ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }
}

// Classe Anneau du serpent
class Anneau {
    constructor(i, j, couleur) {
        this.i = i;
        this.j = j;
        this.couleur = couleur;
    }

    draw() {
        ctx.fillStyle = this.couleur;
        const x = this.i * CELL_SIZE;
        const y = this.j * CELL_SIZE;
        const radius = 6;
        // forme un peu arrondie
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + CELL_SIZE - radius, y);
        ctx.quadraticCurveTo(x + CELL_SIZE, y, x + CELL_SIZE, y + radius);
        ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE - radius);
        ctx.quadraticCurveTo(x + CELL_SIZE, y + CELL_SIZE, x + CELL_SIZE - radius, y + CELL_SIZE);
        ctx.lineTo(x + radius, y + CELL_SIZE);
        ctx.quadraticCurveTo(x, y + CELL_SIZE, x, y + CELL_SIZE - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }    
    

    move(d) {
        switch (d) {
            case 0: this.j = (this.j - 1 + GRID_SIZE) % GRID_SIZE; break; // Haut
            case 1: this.i = (this.i + 1) % GRID_SIZE; break; // Droite
            case 2: this.j = (this.j + 1) % GRID_SIZE; break; // Bas
            case 3: this.i = (this.i - 1 + GRID_SIZE) % GRID_SIZE; break; // Gauche
        }
    }

    copy(a) {
        this.i = a.i;
        this.j = a.j;
    }
}

// Classe Serpent
class Serpent {
    constructor(longueur, i, j, direction) {
        this.anneaux = [];
        this.direction = direction;

        for (let k = 0; k < longueur; k++) {
            let couleur = k === 0 ? "red"  // Tête
                : k === longueur - 1 ? "pink"  // Queue
                : getRandomColor(); // Couleur aléatoire pour le corps
                this.anneaux.push(new Anneau(i, j, couleur));
        }
    }

    // Affichage du serpent
    draw() {
        for (let anneau of this.anneaux) {
            anneau.draw();
        }
    }  
    
    move() {
        let nextI = this.anneaux[0].i;
        let nextJ = this.anneaux[0].j;
    
        switch (this.direction) {
            case 0: nextJ--; break; // Haut
            case 1: nextI++; break; // Droite
            case 2: nextJ++; break; // Bas
            case 3: nextI--; break; // Gauche
        }
    
        if (nextI < 0 || nextI >= GRID_SIZE || nextJ < 0 || nextJ >= GRID_SIZE) {
            return false; // collision avec les bords
        }
        
        if (terrain.estObstacle(nextI, nextJ)) {
            return false; // collision avec un obstacle
        }        
    
        // faire avancer le corps
        for (let k = this.anneaux.length - 1; k > 0; k--) {
            this.anneaux[k].copy(this.anneaux[k - 1]);
        }
    
        this.anneaux[0].i = nextI;
        this.anneaux[0].j = nextJ;

        return true;
    }

    changeDirection(newDirection) {
        
        if (Math.abs(this.direction - newDirection) !== 2) {
            this.direction = newDirection;
        }
    }

    extend() {
        const last = this.anneaux[this.anneaux.length - 1];
        const randomColor = getRandomColor();
        this.anneaux.push(new Anneau(last.i, last.j, randomColor));
    }

    detecteAutoCollision() { // collision tete avec corps
        let head = this.anneaux[0];
        for (let i = 1; i < this.anneaux.length; i++) {
            if (head.i === this.anneaux[i].i && head.j === this.anneaux[i].j) {
                return true;
            }
        }
        return false;
    }
}

class Fruit {
    constructor(terrain) {
        this.terrain = terrain;
        this.placerFruit();
    }

    // Place le fruit à une case libre 
    placerFruit() {
        let i, j;
        do {
            i = getRandomInt(this.terrain.largeur);
            j = getRandomInt(this.terrain.hauteur);
        } while (this.terrain.estObstacle(i, j));
        this.i = i;
        this.j = j;
    }

    draw() {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(
            this.i * CELL_SIZE + CELL_SIZE / 2,
            this.j * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2.5,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }

    estMangePar(serpent) {
        let tete = serpent.anneaux[0];
        return tete.i === this.i && tete.j === this.j;
    }
}

// Création de plusieurs serpents
let serpent1 = new Serpent(5, 10, 10, 1);
let serpent2 = new Serpent(3, 5, 5, getRandomDirection());
let serpent3 = new Serpent(4, 8, 8, getRandomDirection());

// fonction pour tout faire afficher
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    terrain.draw();
    fruit.draw(); 
    serpent1.draw();
    serpent2.draw();
    serpent3.draw();
}

// Initialisation du terrain + obstacles et fruits
const terrain = new Terrain(GRID_SIZE, GRID_SIZE);

let fruit = new Fruit(terrain);

// start/rejouer la partie
function startGame() {
    gameStarted = true;
    score = 0;
    vitesse = 300;
    scoreDisplay.innerHTML = `Score : ${score}`;
    serpent1 = new Serpent(5, 10, 10, 1);
    serpent2 = new Serpent(3, 5, 5, getRandomDirection());
    serpent3 = new Serpent(4, 8, 8, getRandomDirection());
    terrain.grille = Array.from({ length: terrain.hauteur }, () => Array(terrain.largeur).fill(0));
    fruit = new Fruit(terrain);
    gameOver = false;
    gameWon = false;
    loop(); // relancer la boucle de jeu
}

function stopGame() {
    gameStarted = false;
    gameOver = true;
    clearInterval(loop);
}

function restartGame() {
    gameOver = false;
    gameWon = false;
    startGame();
}

// touches
document.addEventListener("keydown", (event) => {
    if (!gameStarted) return;

    switch (event.key) {
        case "z":
            serpent1.changeDirection(0);
            break;
        case "d":
            serpent1.changeDirection(1);
            break;
        case "s":
            serpent1.changeDirection(2);
            break;
        case "q":
            serpent1.changeDirection(3);
            break;
        //case " ":
          //  serpent1.extend();
            //console.log("Nombre d'anneaux après l'allongement :", serpent1.anneaux.length);
            //break;
    }
});

// collision entre serpents
function detecteCollisionSerpents(serpentA, serpentB) {
    let head = serpentA.anneaux[0]; // recupère la tête 
    for (let anneau of serpentB.anneaux) { // parcours les anneaux
        if (head.i === anneau.i && head.j === anneau.j) { // coordonnées
            return true;
        }
    }
    return false;
}

// Affichage du message gagner ou perdu
function afficherMessage(message, classe) {
    const overlay = document.getElementById("message-overlay");
    overlay.textContent = message;
    overlay.className = classe;
    overlay.style.display = "flex";
    setTimeout(() => {
        overlay.style.display = "none";
    }, 3000); // disparaît après 3 secondes
}

function perdu() {
    stopGame();
    let intensity = 5; //tremblement écran
    let count = 10; // nombre de tremblements toutes les 50ms
    let interval = setInterval(() => {
        const dx = Math.random() * intensity - intensity / 2; // décalage horizontal
        const dy = Math.random() * intensity - intensity / 2; // vertical
        canvas.style.transform = `translate(${dx}px, ${dy}px)`;
        count--; // -1 tremblement
        if (count <= 0) { // a 0 message s'affiche
            clearInterval(interval);
            canvas.style.transform = "";
            afficherMessage("Perdu !", "perdu");
        }
    }, 50);
}

function gagner() {
    stopGame();
    afficherMessage("🎉 Vous avez gagné ! Félicitations !", "gagne");
}

let loopInterval;

function loop() {
    clearInterval(loopInterval); // On clear l'ancien intervalle au cas où
    loopInterval = setInterval(() => {
        if (gameOver || gameWon) {
            clearInterval(loopInterval);
            return;
        }

        if (!serpent1.move()) {
            perdu(); // si collision mur ou obstacle ou serpents
            return;
        }

        serpent2.move();
        serpent3.move();
        drawAll();

        if (fruit.estMangePar(serpent1)) {
            serpent1.extend();
            fruit.placerFruit(); //nouveau fruit
            score++;
            scoreDisplay.innerHTML = `Score : ${score}`;

            // Ajouter un obstacle apres avoir mangé
            let i = getRandomInt(terrain.largeur);
            let j = getRandomInt(terrain.hauteur);
            terrain.ajouterObstacle(i, j);

            // Augmenter la vitesse des serpents tous les 5 fruits
            if (score % 5 === 0) {
                vitesse = Math.max(80, vitesse - 40); // limite à 80ms 
                loop(); // Redémarre la boucle avec la nouvelle vitesse
            }

            if (score === 20) { // win a 20 fruits
                gameWon = true;
                gagner();
            }
        }

        if (serpent1.detecteAutoCollision() || detecteCollisionSerpents(serpent1, serpent2) || detecteCollisionSerpents(serpent1, serpent3)) {
            perdu();
            return;
        }

        // Changer direction des autres serpents aléatoirement
        if (Math.random() < 0.1) {
            serpent2.changeDirection(getRandomDirection());
        }

        if (Math.random() < 0.1) {
            serpent3.changeDirection(getRandomDirection());
        }

    }, vitesse);
}

document.getElementById("start").addEventListener("click", startGame);
document.getElementById("restart").addEventListener("click", restartGame);
document.addEventListener("keydown", function(event) {
    switch (event.key.toLowerCase()) {
        case "c":
            startGame();
            break;
        case "r":
            restartGame();
            break;
    }
});
