import {TerritoryBuildingTemplate} from "core/src/templateinterfaces/TerritoryBuildingTemplate";

import {makeDefenderAdvantageEffect} from "./battleEffects";
import
{
  territoryBuildings, sectorCommandFamily,
} from "./buildingFamilies";
import { localize } from "modules/space/localization/localize";
import { getBuildingIconElement } from "modules/space/assets/buildings/buildingAssets";
import {moneyResource} from "modules/money/src/moneyResource";
import {availabilityFlags as commonAvailabilityFlags} from "modules/common/availabilityFlags";
import { coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";


export const sectorCommand: TerritoryBuildingTemplate =
{
  type: "sectorCommand",
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
    [moneyResource.type]: 200,
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
  battleEffects: [makeDefenderAdvantageEffect(0.2)],
};
export const sectorCommand1: TerritoryBuildingTemplate =
{
  type: "sectorCommand1",
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
    [moneyResource.type]: 100,
  },

  maxBuiltAtLocation: 1,

  battleEffects: [makeDefenderAdvantageEffect(0.3)],
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
export const sectorCommand2: TerritoryBuildingTemplate =
{
  type: "sectorCommand2",
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
    [moneyResource.type]: 200,
  },

  maxBuiltAtLocation: 1,

  battleEffects: [makeDefenderAdvantageEffect(0.3)],
  availabilityData:
  {
    flags: [commonAvailabilityFlags.humanLike],
  },
};
export const starBase: TerritoryBuildingTemplate =
{
  type: "starBase",
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
    [moneyResource.type]: 200,
  },

  battleEffects: [makeDefenderAdvantageEffect(0.1)],
  getStandardUpgradeTargets: () =>
  [
    sectorCommand,
  ],
  availabilityData:
  {
    flags: [coreAvailabilityFlags.crucial, commonAvailabilityFlags.humanLike],
  },
};
