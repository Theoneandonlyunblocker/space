import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";

export const drones: RaceTemplate =
{
  type: "drones",
  displayName: "Drones",
  description: "",

  isNotPlayable: false,
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
