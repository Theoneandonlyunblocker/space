import {BuildingTemplate} from "src/templateinterfaces/BuildingTemplate";

import * as technologies from "modules/space/technologies/technologyTemplates";
import { localize } from "../localization/localize";


export const commercialPort: BuildingTemplate =
{
  type: "commercialPort",
  kind: "building",
  get displayName()
  {
    return localize("commercialPort_displayName").toString();
  },
  get description()
  {
    return localize("commercialPort_description").toString();
  },
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
  get displayName()
  {
    return localize("deepSpaceRadar_displayName").toString();
  },
  get description()
  {
    return localize("deepSpaceRadar_description").toString();
  },
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
  get displayName()
  {
    return localize("resourceMine_displayName").toString();
  },
  get description()
  {
    return localize("resourceMine_description").toString();
  },
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
  get displayName()
  {
    return localize("reserachLab_displayName").toString();
  },
  get description()
  {
    return localize("reserachLab_description").toString();
  },
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
  get displayName()
  {
    return localize("thePyramids_displayName").toString();
  },
  get description()
  {
    return localize("thePyramids_description").toString();
  },
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
  get displayName()
  {
    return localize("nationalEpic_displayName").toString();
  },
  get description()
  {
    return localize("nationalEpic_description").toString();
  },
  families: [],

  onBuild: (star, player) =>
  {
    player.money += 999;
  },

  buildCost: 0,

  maxBuiltAtLocation: 1,
  maxBuiltForPlayer: 1,
};
