import {TerritoryBuildingTemplate} from "../../../../src/templateinterfaces/TerritoryBuildingTemplate";

import {getIconElement} from "../resources";
import {makeDefenderAdvantageEffect} from "./battleEffects";
import
{
  territoryBuildings, sectorCommandFamily,
} from "./buildingFamilies";


export const sectorCommand: TerritoryBuildingTemplate =
{
  type: "sectorCommand",
  isTerritoryBuilding: true,
  kind: "building",
  families: [territoryBuildings, sectorCommandFamily],
  displayName: "Sector Command",
  description: "Defence building with slight defender advantage. (All defence buildings must " +
    "be captured to gain control of area)",

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
  displayName: "Sector Command1",
  description: "just testing upgrade paths",

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
  displayName: "Sector Command2",
  description: "just testing upgrade paths",

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
  displayName: "Starbase",
  description: "Defence building with no defender advantage. (All defence buildings must " +
    "be captured to gain control of area)",

  getIconElement: getIconElement.bind(null, "starBase"),
  buildCost: 200,

  battleEffects: [makeDefenderAdvantageEffect(0.1)],
  getStandardUpgradeTargets: () =>
  [
    sectorCommand,
  ],
};
