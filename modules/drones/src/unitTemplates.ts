import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";


export const unitTemplates =
{
  [droneSwarm.key]: droneSwarm,
  [droneCommander.key]: droneCommander,
  [droneBase.key]: droneBase,
};
