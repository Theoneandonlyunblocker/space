import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";


export const unitTemplates =
{
  [droneSwarm.type]: droneSwarm,
  [droneCommander.type]: droneCommander,
  [droneBase.type]: droneBase,
};
