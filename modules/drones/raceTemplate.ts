import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import {distributionGroups} from "../common/distributionGroups";

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
};

export const raceTemplates: TemplateCollection<RaceTemplate> =
{
  [drones.type]: drones,
};
