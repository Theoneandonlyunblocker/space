import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import
{
  getRandomProperty,
  randInt,
} from "../../src/utility";


import {distributionGroups} from "../common/distributionGroups";
import {generateIndependentPlayer} from "../common/generateIndependentPlayer";

import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";

export const drones: RaceTemplate =
{
  type: "drones",
  displayName: "Drones",
  description: "",
  distributionData:
  {
    rarity: 1,
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
};

export const raceTemplates: TemplateCollection<RaceTemplate> =
{
  [drones.type]: drones,
};
