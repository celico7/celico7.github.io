let gem = document.querySelector(".gem-cost");
let parsedGem = parseFloat(gem.innerHTML);

let gpcText = document.getElementById("gpc-text");
let gpsText = document.getElementById("gps-text");

let gemImgContainer = document.querySelector(".gem-img-container");

let gpc = 1;

let gps = 0;

const upgrades = [
    {
        name: 'clicker',
        cost: document.querySelector(".clicker-cost"),
        parsedCost: parseFloat(document.querySelector(".clicker-cost").innerHTML),
        increase: document.querySelector(".clicker-increase"),
        parsedIncrease: parseFloat(document.querySelector(".clicker-increase").innerHTML),
        level: document.querySelector(".clicker-level"),
        gemMultiplier: 1.025,
        costMultiplier: 1.12,
    },
    {
        name: 'pickaxe',
        cost: document.querySelector(".pickaxe-cost"),
        parsedCost: parseFloat(document.querySelector(".pickaxe-cost").innerHTML),
        increase: document.querySelector(".pickaxe-increase"),
        parsedIncrease: parseFloat(document.querySelector(".pickaxe-increase").innerHTML),
        level: document.querySelector(".pickaxe-level"),
        gemMultiplier: 1.03,
        costMultiplier: 1.15,
    },
    {
        name: 'miner',
        cost: document.querySelector(".miner-cost"),
        parsedCost: parseFloat(document.querySelector(".miner-cost").innerHTML),
        increase: document.querySelector(".miner-increase"),
        parsedIncrease: parseFloat(document.querySelector(".miner-increase").innerHTML),
        level: document.querySelector(".miner-level"),
        gemMultiplier: 1.035,
        costMultiplier: 1.11,
    },
    {
        name: 'factory',
        cost: document.querySelector(".factory-cost"),
        parsedCost: parseFloat(document.querySelector(".factory-cost").innerHTML),
        increase: document.querySelector(".factory-increase"),
        parsedIncrease: parseFloat(document.querySelector(".factory-increase").innerHTML),
        level: document.querySelector(".factory-level"),
        gemMultiplier: 1.04,
        costMultiplier: 1.10,
    }
]

function incrementGem(event){
    gem.innerHTML = Math.round(parsedGem += gpc);

    const x = event.offsetX;
    const y = event.offsetY;

    const div = document.createElement("div");
    div.innerHTML = `+${Math.round(gpc)}`;
    div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`;
    gemImgContainer.appendChild(div);

    div.classList.add('fade-up');
    timeout(div);
}

const timeout = (div) => {
    setTimeout(() => {
        div.remove();
    }, 800);
}

function buyUpgrade(upgradeName) {
    const mu = upgrades.find(u => u.name === upgradeName); // Trouve l'objet correspondant

    if (mu && parsedGem >= mu.parsedCost) { // Vérifie si l'objet existe et si le joueur a assez de gemmes
        gem.innerHTML = Math.round(parsedGem -= mu.parsedCost);

        mu.level.innerHTML++;

        mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.gemMultiplier).toFixed(2));
        mu.increase.innerHTML = mu.parsedIncrease;

        mu.parsedCost *= mu.costMultiplier;
        mu.cost.innerHTML = Math.round(mu.parsedCost);

        if (mu.name === 'clicker') {
            gpc += mu.parsedIncrease;
        } else {
            gps += mu.parsedIncrease;
        }
    }
}

function save(){
    localStorage.clear();

    upgrades.map((upgrade) => {

        const obj = JSON.stringify({
            parsedLevel: parseFloat(upgrade.level.innerHTML),
            parsedCost: upgrade.parsedCost,
            parsedIncrease: upgrade.parsedIncrease,
        })

        localStorage.setItem(upgrade.name, obj);

    });

    localStorage.setItem('gpc', JSON.stringify(gpc));
    localStorage.setItem('gps', JSON.stringify(gps));
    localStorage.setItem('gem', JSON.stringify(parsedGem));

}

function load(){
    upgrades.map((upgrade) => {
        const savedValues = JSON.parse(localStorage.getItem(upgrade.name));

        upgrade.parsedCost = savedValues.parsedCost;
        upgrade.parsedIncrease = savedValues.parsedIncrease;

        upgrade.level.innerHTML = savedValues.parsedLevel;
        upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
        upgrade.increase.innerHTML = upgrade.parsedIncrease;
    });

    gpc = JSON.parse(localStorage.getItem('gpc'));
    gps = JSON.parse(localStorage.getItem('gps'));
    parsedGem = JSON.parse(localStorage.getItem('gem'));
    gem.innerHTML = Math.round(parsedGem);
}

setInterval(() => { 
    parsedGem += gps / 10;
    gem.innerHTML = Math.round(parsedGem);
    gpcText.innerHTML = Math.round(gpc);
    gpsText.innerHTML = Math.round(gps);
}, 100);