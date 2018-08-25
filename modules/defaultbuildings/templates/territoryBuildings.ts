import {TerritoryBuildingTemplate} from "../../../src/templateinterfaces/TerritoryBuildingTemplate";

import {makeDefenderAdvantageEffect} from "./battleEffects";


export const sectorCommand: TerritoryBuildingTemplate =
{
  type: "sectorCommand",
  isTerritoryBuilding: true,
  family: "sectorCommand",
  displayName: "Sector Command",
  description: "Defence building with slight defender advantage. (All defence buildings must " +
    "be captured to gain control of area)",

  iconSrc: "sectorCommand.png",
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
  family: "sectorCommand",
  displayName: "Sector Command1",
  description: "just testing upgrade paths",

  iconSrc: "sectorCommand.png",
  buildCost: 100,

  maxBuiltAtLocation: 1,

  battleEffects: [makeDefenderAdvantageEffect(0.3)],
};
export const sectorCommand2: TerritoryBuildingTemplate =
{
  type: "sectorCommand2",
  isTerritoryBuilding: true,
  family: "sectorCommand",
  displayName: "Sector Command2",
  description: "just testing upgrade paths",

  iconSrc: "sectorCommand.png",
  buildCost: 200,

  maxBuiltAtLocation: 1,

  battleEffects: [makeDefenderAdvantageEffect(0.3)],
};
export const starBase: TerritoryBuildingTemplate =
{
  type: "starBase",
  isTerritoryBuilding: true,
  displayName: "Starbase",
  description: "Defence building with no defender advantage. (All defence buildings must " +
    "be captured to gain control of area)",

  iconSrc: "starBase.png",
  buildCost: 200,

  maxBuiltAtLocation: 3,

  battleEffects: [makeDefenderAdvantageEffect(0.1)],
  getStandardUpgradeTargets: () =>
  [
    sectorCommand,
  ],
};
