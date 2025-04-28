import { defaultSkillValues } from "./defaultValues.js";

function createUpgrades() {
  const upgradesContainer = document.getElementById('upgrades-container')
  const template = document.getElementById('upgrade-template').textContent

  defaultSkillValues.forEach((obj) => {
    let html = template;

    Object.keys(obj).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, obj[key])
    });

    upgradesContainer.innerHTML += html
  })
}

createUpgrades()

export const skill = [
  {
  name: 'concentré étoilé',
    cost: document.querySelector(".concentré étoilé-cost"),
    parsedCost: parseFloat(document.querySelector(".concentré étoilé-cost").innerHTML),
    increase: document.querySelector(".concentré étoilé-increase"),
    parsedIncrease: parseFloat(document.querySelector(".concentré étoilé-increase").innerHTML),
    gemMultiplier: 1.025,
    costMultiplier: 1.12,
  },
]