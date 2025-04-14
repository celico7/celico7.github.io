export const defaultUpgradeValues = [
    {name: 'curseur', image: './assets/upgrades/cursor.png', cost: 10, increase: 1, type: "upgrade"},
    {name: 'pioche', image: './assets/upgrades/pickaxe.png', cost: 60, increase: 4, type: "upgrade"},
    {name: 'gnome', image: './assets/upgrades/miner.png', cost: 480, increase: 32, type: "upgrade"},
    {name: 'usine', image: './assets/upgrades/factory.png', cost: 4240, increase: 410, type: "upgrade"},
    {name: 'potion', image: './assets/upgrades/potion.png', cost: 52800, increase: 5500, type: "upgrade"},
  ]
  
  export const defaultSkillValues = [
   {
    name: "concentré étoilé",
    description: "+80 de clique pendant 30 secondes",
    image: "./assets/skills/skill1.png",
    increase: 80,
    cd: 600,
    cost: 12000,
    duration: 30000,
    type: "skill"
   },
   {
    name: "Lucky Day",
    description: "Gain 600 x GPS worth of gems instantly",
    image: "./assets/skills/skill1.png",
    cd: 900,
    cost: 480000,
    type: "skill"
   }
  ]
  
  export const defaultArtifactValues = [
    {
      name: "Artifact 1",
      description: "Permanently increase all gems gained by x amount",
      image: "",
      type: "artifact"
    }
  ]