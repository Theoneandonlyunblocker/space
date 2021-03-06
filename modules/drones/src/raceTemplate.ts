import {RaceTemplate} from "core/src/templateinterfaces/RaceTemplate";
import {TemplateCollection} from "core/src/generic/TemplateCollection";
import
{
  randInt,
} from "core/src/generic/utility";
import {distributionGroups} from "modules/baselib/src/distributionGroups";
import {generateIndependentFleets} from "modules/baselib/src/generateIndependentFleets";
import {generateIndependentPlayer} from "modules/baselib/src/generateIndependentPlayer";
import {defaultAiConstructor} from "modules/defaultai/src/mapai/DefaultAiConstructor";

import { getBuildableThingsByAvailabilityFlags } from "core/src/production/getBuildableThingsByAvailabilityFlags";
import { localizeName } from "../localization/localize";
import { activeModuleData } from "core/src/app/activeModuleData";
import { availabilityFlags } from "./availabilityFlags";
import { AvailabilityData, coreAvailabilityFlags } from "core/src/templateinterfaces/AvailabilityData";



function getBuildableThings<T extends {availabilityData: AvailabilityData}>(templates: TemplateCollection<T>): T[]
{
  return getBuildableThingsByAvailabilityFlags(templates, flags =>
  {
    return flags.has(availabilityFlags.drone) || flags.has(coreAvailabilityFlags.crucial);
  });
}

export const drones: RaceTemplate =
{
  key: "drones",
  get displayName()
  {
    return localizeName("drones")();
  },
  description: "",
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.common, distributionGroups.rare],
  },
  isNotPlayable: true,
  getBuildableBuildings: () => getBuildableThings(activeModuleData.templates.buildings),
  getBuildableItems: () => getBuildableThings(activeModuleData.templates.items),
  getBuildableUnits: () => getBuildableThings(activeModuleData.templates.units),
  associatedAvailabilityFlags: [availabilityFlags.drone],
  getPlayerName: player => localizeName("droneHost")(randInt(0, 20000)),
  getFleetName: fleet => localizeName("swarm")(fleet.id),
  getUnitName: unitTemplate => localizeName("unitName")(unitTemplate.displayName, randInt(0, 20000)),
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return allTemplates.getRandom();
  },
  generateIndependentPlayer: emblemTemplates =>
  {
    return generateIndependentPlayer(drones);
  },
  generateIndependentFleets: (player, location, globalStrength, localStrength, maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleets(drones, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },
  technologies: [],
  getAiTemplateConstructor: player => defaultAiConstructor,
};

export const raceTemplates =
{
  [drones.key]: drones,
};
