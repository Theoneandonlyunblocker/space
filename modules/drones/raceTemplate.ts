import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import Name from "../../src/Name";

import
{
  getRandomProperty,
  randInt,
} from "../../src/utility";


import {distributionGroups} from "../common/distributionGroups";
import {generateIndependentFleet} from "../common/generateIndependentFleet";
import {generateIndependentPlayer} from "../common/generateIndependentPlayer";

import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";

export const drones: RaceTemplate =
{
  type: "drones",
  displayName: new Name("Drones", true),
  description: "",
  distributionData:
  {
    weight: 1,
    distributionGroups: [distributionGroups.common, distributionGroups.rare],
  },

  isNotPlayable: true,
  getBuildableUnitTypes: (player) =>
  {
    return(
    [
      droneSwarm,
      droneCommander,
      droneBase,
    ]);
  },

  getUnitName: (unitTemplate) =>
  {
    return `${unitTemplate.displayName} #${randInt(0, 20000)}`;
  },
  getUnitPortrait: (unitTemplate, allTemplates) =>
  {
    return getRandomProperty(allTemplates);
  },

  generateIndependentPlayer: (emblemTemplates) =>
  {
    return generateIndependentPlayer(drones);
  },
  generateIndependentFleet: (player, location, globalStrength, localStrength,
    maxUnitsPerSideInBattle) =>
  {
    return generateIndependentFleet(drones, player, location,
      globalStrength, localStrength, maxUnitsPerSideInBattle);
  },
};

export const raceTemplates: TemplateCollection<RaceTemplate> =
{
  [drones.type]: drones,
};
