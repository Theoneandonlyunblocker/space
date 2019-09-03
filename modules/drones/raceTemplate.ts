import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
import {TemplateCollection} from "../../src/templateinterfaces/TemplateCollection";
import
{
  getRandomProperty,
  randInt,
} from "../../src/generic/utility";
import {distributionGroups} from "../common/distributionGroups";
import {generateIndependentFleets} from "../common/generateIndependentFleets";
import {generateIndependentPlayer} from "../common/generateIndependentPlayer";
import {defaultAiConstructor} from "../defaultai/mapai/DefaultAiConstructor";

import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";
import { localizeName } from "./localization/localize";


export const drones: RaceTemplate =
{
  type: "drones",
  get displayName()
  {
    return localizeName("drones");
  },
  description: "",
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.common, distributionGroups.rare],
  },
  isNotPlayable: true,
  getBuildableBuildings: () => [],
  getBuildableItems: () => [],
  getBuildableUnits: () =>
  [
    droneSwarm,
    droneCommander,
    droneBase,
  ],
  getPlayerName: player => localizeName("droneHost")(randInt(0, 20000)),
  getFleetName: fleet => localizeName("swarm")(fleet.id),
  getUnitName: unitTemplate =>
  {
    return `${unitTemplate.displayName} #${randInt(0, 20000)}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
  },
  generateIndependentPlayer: emblemTemplates =>
  {
    return generateIndependentPlayer(drones);
  },
  generateIndependentFleets: (player, location, globalStrength, localStrength,
    maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleets(drones, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },
  technologies: [],
  getAiTemplateConstructor: player => defaultAiConstructor,
};

export const raceTemplates: TemplateCollection<RaceTemplate> =
{
  [drones.type]: drones,
};
