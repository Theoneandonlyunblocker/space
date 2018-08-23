import {BuildingTemplate} from "../../../src/templateinterfaces/BuildingTemplate";


export const commercialPort: BuildingTemplate =
{
  type: "commercialPort",
  displayName: "Commercial Spaceport",
  description: "Increase star income by 20",

  buildCost: 200,
  maxBuiltAtLocation: 1,
  maxUpgradeLevel: 4,

  getEffect: (upgradeLevel) =>
  {
    const incomePerLevel = 20;

    return(
    {
      income: {flat: incomePerLevel * upgradeLevel},
    });
  },

};
export const deepSpaceRadar: BuildingTemplate =
{
  type: "deepSpaceRadar",
  displayName: "Deep Space Radar",
  description: "Increase star vision and detection radius",

  buildCost: 200,

  maxBuiltAtLocation: 1,
  maxUpgradeLevel: 2,

  getEffect: (upgradeLevel) =>
  {
    return(
    {
      vision: {flat: 1},
      detection: {flat: 1},
    });
  },

};
export const resourceMine: BuildingTemplate =
{
  type: "resourceMine",
  displayName: "Mine",
  description: "Gathers resources from current star",

  buildCost: 500,

  maxBuiltAtLocation: 1,
  maxUpgradeLevel: 3,
  canBeBuiltInLocation: (star) =>
  {
    return Boolean(star.resource);
  },

  getEffect: (upgradeLevel) =>
  {
    return(
    {
      resourceIncome:
      {
        flat: 1,
      },
    });
  },
};
export const reserachLab: BuildingTemplate =
{
  type: "reserachLab",
  displayName: "Research Lab",
  description: "Increase research speed",

  buildCost: 300,

  maxBuiltAtLocation: 1,
  maxUpgradeLevel: 3,

  getEffect: (upgradeLevel) =>
  {
    return(
    {
      researchPoints: {flat: 10},
    });
  },
};
export const thePyramids: BuildingTemplate =
{
  type: "thePyramids",
  displayName: "The Pyramids",
  description: "",

  onBuild: (star, player) =>
  {
    player.money += 1000;
  },

  buildCost: 0,

  maxBuiltAtLocation: 1,
  maxUpgradeLevel: 1,
  maxBuiltGlobally: 1,
};
