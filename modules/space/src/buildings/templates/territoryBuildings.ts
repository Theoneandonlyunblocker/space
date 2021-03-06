import {TerritoryBuildingTemplate} from "core/src/templateinterfaces/TerritoryBuildingTemplate";

import
{
  territoryBuildings, sectorCommandFamily,
} from "./buildingFamilies";
import { localize } from "modules/space/localization/localize";
import { getBuildingIconElement } from "modules/space/assets/buildings/buildingAssets";
import {moneyResource} from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/baselib/src/availabilityFlags";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";
import { makeDefenderAdvantageEffect } from "./battlePrepEffects";


export const sectorCommand: TerritoryBuildingTemplate =
{
  key: "sectorCommand",
  isTerritoryBuilding: true,
  families: [territoryBuildings, sectorCommandFamily],
  get displayName()
  {
    return localize("sectorCommand_displayName").toString();
  },
  get description()
  {
    return localize("sectorCommand_description").toString();
  },
  getIconElement: getBuildingIconElement.bind(null, "sectorCommand"),
  buildCost:
  {
    [moneyResource.key]: 200,
  },

  maxBuiltAtLocation: 1,
  availabilityData:
  {
    flags: [coreAvailabilityFlags.crucial, commonAvailabilityFlags.humanLike],
  },

  getStandardUpgradeTargets: () =>
  [
    sectorCommand1,
    sectorCommand2,
  ],
  mapLevelModifiers:
  [
    {
      key: "defenderAdvantage",
      battlePrepEffects: [makeDefenderAdvantageEffect(0.2)],
    },
  ],
};
export const sectorCommand1: TerritoryBuildingTemplate =
{
  key: "sectorCommand1",
  isTerritoryBuilding: true,
  families: [territoryBuildings, sectorCommandFamily],
  get displayName()
  {
    return localize("sectorCommand1_displayName").toString();
  },
  get description()
  {
    return localize("sectorCommand1_description").toString();
  },
  getIconElement: getBuildingIconElement.bind(null, "sectorCommand"),
  buildCost:
  {
    [moneyResource.key]: 100,
  },

  maxBuiltAtLocation: 1,

  mapLevelModifiers:
  [
    {
      key: "defenderAdvantage",
      battlePrepEffects: [makeDefenderAdvantageEffect(0.3)],
    },
  ],
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
export const sectorCommand2: TerritoryBuildingTemplate =
{
  key: "sectorCommand2",
  isTerritoryBuilding: true,
  families: [territoryBuildings, sectorCommandFamily],
  get displayName()
  {
    return localize("sectorCommand2_displayName").toString();
  },
  get description()
  {
    return localize("sectorCommand2_description").toString();
  },
  getIconElement: getBuildingIconElement.bind(null, "sectorCommand"),
  buildCost:
  {
    [moneyResource.key]: 200,
  },

  maxBuiltAtLocation: 1,

  mapLevelModifiers:
  [
    {
      key: "defenderAdvantage",
      battlePrepEffects: [makeDefenderAdvantageEffect(0.3)],
    },
  ],
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
export const starBase: TerritoryBuildingTemplate =
{
  key: "starBase",
  isTerritoryBuilding: true,
  families: [territoryBuildings],
  get displayName()
  {
    return localize("starBase_displayName").toString();
  },
  get description()
  {
    return localize("starBase_description").toString();
  },
  getIconElement: getBuildingIconElement.bind(null, "starBase"),
  buildCost:
  {
    [moneyResource.key]: 200,
  },

  mapLevelModifiers:
  [
    {
      key: "defenderAdvantage",
      battlePrepEffects: [makeDefenderAdvantageEffect(0.1)],
    },
  ],
  getStandardUpgradeTargets: () =>
  [
    sectorCommand,
  ],
  availabilityData:
  {
    flags: [coreAvailabilityFlags.crucial, commonAvailabilityFlags.humanLike],
  },
};
