import { defaultUpgradeValues } from "./defaultValues.js";

function createUpgrades() {
  const upgradesContainer = document.getElementById('upgrades-container')
  const template = document.getElementById('upgrade-template').textContent

  defaultUpgradeValues.forEach((obj) => {
    let html = template;

    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, obj[key])
    });

    upgradesContainer.innerHTML += html
  })
}

createUpgrades()

export const upgrades = [
  {
    name: 'curseur',
    cost: document.querySelector(".curseur-cost"),
    parsedCost: parseFloat(document.querySelector(".curseur-cost").innerHTML),
    increase: document.querySelector(".curseur-increase"),
    parsedIncrease: parseFloat(document.querySelector(".curseur-increase").innerHTML),
    level: document.querySelector(".curseur-level"),
    powerUps: [
      {
        name: "2x curseur",
        description: "double les cliques",
        multiplier: 2,
      },
      {
        name: "3x curseur",
        description: "triple les cliques",
        multiplier: 3,
      },
      {
        name: "2x curseur",
        description: "double les cliques",
        multiplier: 2,
      },
    ],
    gemMultiplier: 1.025,
    costMultiplier: 1.12,
  },
  {
    name: 'pioche',
    cost: document.querySelector(".pioche-cost"),
    parsedCost: parseFloat(document.querySelector(".pioche-cost").innerHTML),
    increase: document.querySelector(".pioche-increase"),
    parsedIncrease: parseFloat(document.querySelector(".pioche-increase").innerHTML),
    level: document.querySelector(".pioche-level"),
    powerUps: [
      {
        name: "2x pioche",
        description: "double l'efficacité de la pioche",
        multiplier: 2,
      },
      {
        name: "3x pioche",
        description: "triple l'efficacité de la pioche",
        multiplier: 3,
      },
      {
        name: "2x pioche",
        description: "double l'efficacité de la pioche",
        multiplier: 2,
      },
    ],
    power: 0,
    gemMultiplier: 1.03,
    costMultiplier: 1.115,
  },
  {
    name: 'gnome',
    cost: document.querySelector(".gnome-cost"),
    parsedCost: parseFloat(document.querySelector(".gnome-cost").innerHTML),
    increase: document.querySelector(".gnome-increase"),
    parsedIncrease: parseFloat(document.querySelector(".gnome-increase").innerHTML),
    level: document.querySelector(".gnome-level"),
    power: 0,
    gemMultiplier: 1.035,
    costMultiplier: 1.11,
  },
  {
    name: 'usine',
    cost: document.querySelector(".usine-cost"),
    parsedCost: parseFloat(document.querySelector(".usine-cost").innerHTML),
    increase: document.querySelector(".usine-increase"),
    parsedIncrease: parseFloat(document.querySelector(".usine-increase").innerHTML),
    level: document.querySelector(".usine-level"),
    power: 0,
    gemMultiplier: 1.04,
    costMultiplier: 1.10,
  },
  {
    name: 'potion',
    cost: document.querySelector(".potion-cost"),
    parsedCost: parseFloat(document.querySelector(".potion-cost").innerHTML),
    increase: document.querySelector(".potion-increase"),
    parsedIncrease: parseFloat(document.querySelector(".potion-increase").innerHTML),
    level: document.querySelector(".potion-level"),
    power: 0,
    gemMultiplier: 1.045,
    costMultiplier: 1.096,
  },
]

export const powerUpIntervals = [10, 20, 30, 50, 70, 100, 150, 200, 250, 300] // interval d'apparition pour les power ups

