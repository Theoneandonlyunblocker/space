import {TemplateCollection} from "core/templateinterfaces/TemplateCollection";
import {UnitTemplate} from "core/templateinterfaces/UnitTemplate";

import {droneBase} from  "./units/droneBase";
import {droneCommander} from  "./units/droneCommander";
import {droneSwarm} from  "./units/droneSwarm";


export const unitTemplates: TemplateCollection<UnitTemplate> =
{
  [droneSwarm.type]: droneSwarm,
  [droneCommander.type]: droneCommander,
  [droneBase.type]: droneBase,
};
