import {TerritoryBuildingTemplate} from "core/templateinterfaces/TerritoryBuildingTemplate";

import {getIconElement} from "../resources";
import {makeDefenderAdvantageEffect} from "./battleEffects";
import
{
  territoryBuildings, sectorCommandFamily,
} from "./buildingFamilies";
import { localize } from "../localization/localize";


export const sectorCommand: TerritoryBuildingTemplate =
{
  type: "sectorCommand",
  isTerritoryBuilding: true,
  kind: "building",
  families: [territoryBuildings, sectorCommandFamily],
  get displayName()
  {
    return localize("sectorCommand_displayName").toString();
  },
  get description()
  {
    return localize("sectorCommand_description").toString();
  },
  getIconElement: getIconElement.bind(null, "sectorCommand"),
  buildCost: 200,

  maxBuiltAtLocation: 1,

  getStandardUpgradeTargets: () =>
  [
    sectorCommand1,
    sectorCommand2,
  ],
  battleEffects: [makeDefenderAdvantageEffect(0.2)],
};
export const sectorCommand1: TerritoryBuildingTemplate =
{
  type: "sectorCommand1",
  isTerritoryBuilding: true,
  kind: "building",
  families: [territoryBuildings, sectorCommandFamily],
  get displayName()
  {
    return localize("sectorCommand1_displayName").toString();
  },
  get description()
  {
    return localize("sectorCommand1_description").toString();
  },
  getIconElement: getIconElement.bind(null, "sectorCommand"),
  buildCost: 100,

  maxBuiltAtLocation: 1,

  battleEffects: [makeDefenderAdvantageEffect(0.3)],
};
export const sectorCommand2: TerritoryBuildingTemplate =
{
  type: "sectorCommand2",
  isTerritoryBuilding: true,
  kind: "building",
  families: [territoryBuildings, sectorCommandFamily],
  get displayName()
  {
    return localize("sectorCommand2_displayName").toString();
  },
  get description()
  {
    return localize("sectorCommand2_description").toString();
  },
  getIconElement: getIconElement.bind(null, "sectorCommand"),
  buildCost: 200,

  maxBuiltAtLocation: 1,

  battleEffects: [makeDefenderAdvantageEffect(0.3)],
};
export const starBase: TerritoryBuildingTemplate =
{
  type: "starBase",
  isTerritoryBuilding: true,
  kind: "building",
  families: [territoryBuildings],
  get displayName()
  {
    return localize("starBase_displayName").toString();
  },
  get description()
  {
    return localize("starBase_description").toString();
  },
  getIconElement: getIconElement.bind(null, "starBase"),
  buildCost: 200,

  battleEffects: [makeDefenderAdvantageEffect(0.1)],
  getStandardUpgradeTargets: () =>
  [
    sectorCommand,
  ],
};
