import { powerUpIntervals, upgrades } from "./constants/upgrades.js";
import { defaultSkillValues, defaultUpgradeValues } from "./constants/defaultValues.js";

let gem = document.querySelector(".gem-cost");
let parsedGem = parseFloat(gem.innerHTML);

let gpcText = document.getElementById("gpc-text")
let gpsText = document.getElementById("gps-text")

let gemImgContainer = document.querySelector('.gem-img-container')

let upgradesNavButton = document.getElementById('upgrades-nav-button')
let skillsNavButton = document.getElementById('skills-nav-button')
let artifactsNavButton = document.getElementById('artifacts-nav-button')

let prestigeButton = document.querySelector(".prestige-button")

let relic = document.getElementById("relic")

let gpc = 1;

let gps = 0;

const skillCooldowns = {}; // stocke les cooldowns actifs

function incrementGem(event) {

  gem.innerHTML = Math.round(parsedGem += gpc);

  const x = event.offsetX
  const y = event.offsetY

  const div = document.createElement('div')
  div.innerHTML = `+${Math.round(gpc)}`  
  div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`
  gemImgContainer.appendChild(div)

  div.classList.add('fade-up')

  timeout(div)
}

const timeout = (div) => {
  setTimeout(() => {
    div.remove()
  }, 800)
}

function initializeUI() {
  setActiveTab(upgradesNavButton); // Par défaut, on commence sur "Upgrades"
  const upgradeContainers = document.querySelectorAll(".upgrade");

  upgradeContainers.forEach((container) => {
    if (container.classList.contains("type-upgrade")) container.style.display = "flex";
    else container.style.display = "none";
  });

  updateUpgradesVisibility(); // Cache les upgrades trop chères
}

initializeUI();


function updateUpgradesVisibility() {
  
  const isUpgradesTabActive = upgradesNavButton.classList.contains("active"); // Vérifie si l'onglet "Améliorations" est actif

  if (!isUpgradesTabActive) return; // Ne fait rien si l'onglet "Améliorations" n'est pas actif

  upgrades.forEach((upgrade) => {
    const upgradeDiv = document.getElementById(`${upgrade.name}-upgrade`);
    const level = parseInt(upgrade.level.innerHTML, 10); // Récupère le niveau actuel de l'amélioration

    if (level > 0 || parsedGem >= upgrade.parsedCost) {
      upgradeDiv.style.display = "flex"; // Affiche l'amélioration
    } else {
      upgradeDiv.style.display = "none"; // Cache l'amélioration
    }
  });
}

// Ajoutez une classe "active" à l'onglet actif
function setActiveTab(tabButton) {
  document.querySelectorAll(".right-navbar > div").forEach((button) => {
    button.classList.remove("active");
  });
  tabButton.classList.add("active");
}

// Modifiez les gestionnaires d'événements pour activer les onglets
skillsNavButton.addEventListener("click", function () {
  setActiveTab(skillsNavButton);
  const upgradeContainers = document.querySelectorAll(".upgrade");

  upgradeContainers.forEach((container) => {
    if (container.classList.contains("type-skill")) container.style.display = "flex";
    else container.style.display = "none";
  });
});

upgradesNavButton.addEventListener("click", function () {
  setActiveTab(upgradesNavButton);
  const upgradeContainers = document.querySelectorAll(".upgrade");

  upgradeContainers.forEach((container) => {
    if (container.classList.contains("type-upgrade")) container.style.display = "flex";
    else container.style.display = "none";
  });

});

artifactsNavButton.addEventListener("click", function () {
  setActiveTab(artifactsNavButton);
  const upgradeContainers = document.querySelectorAll(".upgrade");

  upgradeContainers.forEach((container) => {
    if (container.classList.contains("type-artifact")) container.style.display = "flex";
    else container.style.display = "none";
  });
});

// Appeler updateUpgradesVisibility immédiatement après le chargement de la page
updateUpgradesVisibility();


function buyUpgrade(upgradeName) {
  const mu = upgrades.find((u) => u.name === upgradeName);
  if (!mu) return;

  if (parsedGem < mu.parsedCost) return;

  parsedGem -= mu.parsedCost;
  gem.innerHTML = Math.round(parsedGem);

  const upgradeLevel = document.querySelector(`.${mu.name}-level`);
  const currentLevel = parseInt(upgradeLevel.innerHTML);
  const nextLevel = currentLevel + 1;
  upgradeLevel.innerHTML = nextLevel;
  

  const upgradeDiv = document.getElementById(`${mu.name}-upgrade`);
  const nextLevelDiv = document.getElementById(`${mu.name}-next-level`);
  const nextLevelP = document.getElementById(`${mu.name}-next-p`);

  // Vérifie si un power-up s’applique à ce niveau
  const powerUpIndex = powerUpIntervals.indexOf(nextLevel);
  const hasPowerUp = powerUpIndex !== -1;
  const powerUp = mu.powerUps?.[powerUpIndex];

  if (hasPowerUp && powerUp) {
    // Applique le power-up
    if (mu.name === 'curseur') {
      gpc *= powerUp.multiplier;
    } else {
      gps -= mu.power;
      mu.power *= powerUp.multiplier;
      gps += mu.power;
    }

    // Style spécial pour power-up
    upgradeDiv.style.borderColor = 'orange';
    nextLevelDiv.style.cssText = 'background-color: #CC4500; font-weight: bold';
    nextLevelP.innerText = powerUp.description;

    mu.parsedCost *= 2.5 * 1.004 ** nextLevel;
  } else {
    // Pas de power-up, augmentation normale
    mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.gemMultiplier).toFixed(2));
    mu.parsedCost *= mu.costMultiplier;

    if (mu.name === 'curseur') {
      gpc += mu.parsedIncrease;
      nextLevelP.innerText = `+${mu.parsedIncrease} bonbons par clique`;
    } else {
      gps -= mu.power;
      mu.power += mu.parsedIncrease;
      gps += mu.power;
      nextLevelP.innerText = `+${mu.parsedIncrease} bonbons par secondes`;
    }

    upgradeDiv.style.borderColor = 'white';
    nextLevelDiv.style.cssText = 'background-color: #5A5959; font-weight: normal';
  }

  // Mise à jour des valeurs affichées
  mu.cost.innerHTML = Math.round(mu.parsedCost);
  mu.increase.innerHTML = mu.parsedIncrease;
  

  document.querySelector(`.${mu.name}-cost`).innerHTML = Math.round(mu.parsedCost);
  document.querySelector(`.${mu.name}-increase`).innerHTML = mu.parsedIncrease;
}


function buySkill(skillName) {
  const skill = defaultSkillValues.find((s) => s.name === skillName);
  if (!skill) return;

  // Vérifie le cooldown
  if (skillCooldowns[skill.name]) {
    console.log(`Compétence "${skill.name}" encore en cooldown.`);
    return;
  }

  if (parsedGem >= skill.cost) {
    parsedGem -= skill.cost;
    gem.innerHTML = Math.round(parsedGem);

    switch (skill.name) {
      case "concentré étoilé":
        gpc += skill.increase;
        gpcText.innerHTML = Math.round(gpc);
        showProgressBar(skill.name, skill.duration || 30000);
        setCooldown(skill.name, skill.cd || 60000); // durée de cooldown (ms)

        setTimeout(() => {
          gpc -= skill.increase;
          gpcText.innerHTML = Math.round(gpc);
        }, skill.duration || 30000);
        break;

      case "Lucky Day":
        parsedGem += gps * 600;
        gem.innerHTML = Math.round(parsedGem);
        setCooldown(skill.name, skill.cd || 90000); // cooldown = 90s par exemple
        break;

      default:
        console.log(`Aucun effet défini pour la compétence "${skill.name}"`);
        break;
    }
  } 
}

function showProgressBar(skillName, duration) {
  const container = document.getElementById(`${skillName}-progress-container`);
  const bar = document.getElementById(`${skillName}-progress-bar`);

  if (!container || !bar) return;

  container.style.display = "block";
  bar.style.width = "0%";

  let width = 0;
  const intervalTime = 10;
  const increment = (100 * intervalTime) / duration;

  // Important : on stocke l'interval par compétence pour pouvoir le clear si besoin
  if (container.dataset.intervalId) {
    clearInterval(container.dataset.intervalId);
  }

  const id = setInterval(() => {
    width += increment;
    if (width >= 100) {
      width = 100;
      clearInterval(id);
      container.style.display = "none";
      container.dataset.intervalId = "";
    }
    bar.style.width = width + "%";
  }, intervalTime);

  container.dataset.intervalId = id;
}


function setCooldown(skillName, cooldownDuration) {
  skillCooldowns[skillName] = true;

  // Désactiver le bouton de la compétence
  const button = document.querySelector(`[data-skill-name="${skillName}"]`);
  if (button) {
    button.disabled = true;
    button.classList.add("on-cooldown");
  }

  // Réactiver après le cooldown
  setTimeout(() => {
    skillCooldowns[skillName] = false;
    if (button) {
      button.disabled = false;
      button.classList.remove("on-cooldown");
    }
  }, cooldownDuration);
}

function prestige () {
  upgrades.map((upgrade) => {
    const mu = defaultUpgradeValues.find((u) => { if (upgrade.name === u.name) return u })

    upgrade.parsedCost = mu.cost
    upgrade.parsedIncrease = mu.increase

    upgrade.level.innerHTML = 0
    upgrade.cost.innerHTML = mu.cost
    upgrade.increase.innerHTML = mu.increase

    const upgradeDiv = document.getElementById(`${mu.name}-upgrade`)
    const nextLevelDiv = document.getElementById(`${mu.name}-next-level`)
    const nextLevelP = document.getElementById(`${mu.name}-next-p`)

    upgradeDiv.style.cssText = `border-color: white`;
    nextLevelDiv.style.cssText =  `background-color: #5A5959; font-weight: normal`;
    nextLevelP.innerHTML = `+${mu.increase} bonbons par clique`
  })

  relic.innerHTML = Math.ceil(Math.sqrt(parsedGem - 999999) / 300)

  gpc = 1
  gps = 0
  parsedGem = 0
  gem.innerHTML = parsedGem
}

setInterval(() => {
  parsedGem += gps / 10
  gem.innerHTML = Math.round(parsedGem)
  gpcText.innerHTML = Math.round(gpc)
  gpsText.innerHTML = Math.round(gps);
  
  if (parsedGem >= 1_000_000) {
    prestigeButton.style.display = "block"
  } else {
    prestigeButton.style.display = "none"
  }

  updateUpgradesVisibility(); // Met à jour la visibilité des améliorations
}, 100);
function save () {
  localStorage.clear()

  upgrades.map((upgrade) => {

    const obj = JSON.stringify({
      parsedLevel: parseFloat(upgrade.level.innerHTML),
      parsedCost: upgrade.parsedCost,
      parsedIncrease: upgrade.parsedIncrease
    })

    localStorage.setItem(upgrade.name, obj)

  })

  localStorage.setItem('gpc', JSON.stringify(gpc))
  localStorage.setItem('gps', JSON.stringify(gps))
  localStorage.setItem('gem', JSON.stringify(parsedGem))
}

function load () {
  upgrades.map((upgrade) => {
    const savedValues = JSON.parse(localStorage.getItem(upgrade.name))

    upgrade.parsedCost = savedValues.parsedCost
    upgrade.parsedIncrease = savedValues.parsedIncrease

    upgrade.level.innerHTML = savedValues.parsedLevel
    upgrade.cost.innerHTML = Math.round(upgrade.parsedCost)
    upgrade.increase.innerHTML = upgrade.parsedIncrease
  })

  gpc = JSON.parse(localStorage.getItem('gpc'))
  gps = JSON.parse(localStorage.getItem('gps'))
  parsedGem = JSON.parse(localStorage.getItem('gem'))

  gem.innerHTML = Math.round(parsedGem)
}
function handleBuy(type, name) {
  if (type === "upgrade") {
    buyUpgrade(name);
  } else if (type === "skill") {
    buySkill(name);
  } else if (type === "artifact") {
    buyArtifact(name); // à définir plus tard si tu veux gérer les artefacts aussi
  }
}

window.handleBuy = handleBuy;
window.incrementGem = incrementGem
window.buyUpgrade = buyUpgrade 
window.save = save
window.load = load
window.prestige = prestige