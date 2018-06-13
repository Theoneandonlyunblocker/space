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

  maxPerType: 1,

  maxUpgradeLevel: 1,

  upgradeInto:
  [
    {
      templateType: "sectorCommand1",
      level: 1,
    },
    {
      templateType: "sectorCommand2",
      level: 1,
    },
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

  maxPerType: 1,

  maxUpgradeLevel: 1,
  upgradeOnly: true,
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

  maxPerType: 1,

  maxUpgradeLevel: 1,
  upgradeOnly: true,
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

  maxPerType: 3,

  maxUpgradeLevel: 1,
  battleEffects: [makeDefenderAdvantageEffect(0.1)],
  upgradeInto:
  [
    {
      templateType: "sectorCommand",
      level: 1,
    },
  ],
};
