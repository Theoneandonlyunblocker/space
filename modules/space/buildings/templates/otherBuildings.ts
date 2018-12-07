import {BuildingTemplate} from "../../../../src/templateinterfaces/BuildingTemplate";

import * as technologies from "../../technologies/technologyTemplates";


export const commercialPort: BuildingTemplate =
{
  type: "commercialPort",
  kind: "building",
  displayName: "Commercial Spaceport",
  description: "Increase star income by 20",
  families: [],

  buildCost: 200,
  maxBuiltAtLocation: 1,

  getEffect: () =>
  {
    return(
    {
      income: {flat: 20},
    });
  },
};
export const deepSpaceRadar: BuildingTemplate =
{
  type: "deepSpaceRadar",
  kind: "building",
  displayName: "Deep Space Radar",
  description: "Increase star vision and detection radius by 1",
  families: [],

  buildCost: 200,

  maxBuiltAtLocation: 1,

  getEffect: () =>
  {
    return(
    {
      vision: {flat: 1},
      detection: {flat: 1},
    });
  },
  techRequirements:
  [
    {
      technology: technologies.stealth,
      level: 1,
    }
  ]
};
export const resourceMine: BuildingTemplate =
{
  type: "resourceMine",
  kind: "building",
  displayName: "Mine",
  description: "Gathers 1 resource per turn from current star",
  families: [],

  buildCost: 500,

  maxBuiltAtLocation: 1,
  canBeBuiltInLocation: (star) =>
  {
    return Boolean(star.resource);
  },

  getEffect: () =>
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
  kind: "building",
  displayName: "Research Lab",
  description: "Increase research speed by 10",
  families: [],

  buildCost: 300,

  maxBuiltAtLocation: 1,

  getEffect: () =>
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
  kind: "building",
  displayName: "The Pyramids",
  description: "",
  families: [],

  onBuild: (star, player) =>
  {
    player.money += 1000;
  },

  buildCost: 0,

  maxBuiltAtLocation: 1,
  maxBuiltGlobally: 1,
};
export const nationalEpic: BuildingTemplate =
{
  type: "nationalEpic",
  kind: "building",
  displayName: "National Epic",
  description: "",
  families: [],

  onBuild: (star, player) =>
  {
    player.money += 999;
  },

  buildCost: 0,

  maxBuiltAtLocation: 1,
  maxBuiltForPlayer: 1,
};
