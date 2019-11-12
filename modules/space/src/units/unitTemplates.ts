import {TemplateCollection} from "core/src/templateinterfaces/TemplateCollection";
import {UnitTemplate} from "core/src/templateinterfaces/UnitTemplate";

import {battleCruiser} from  "./templates/battleCruiser";
import {bomberSquadron} from  "./templates/bomberSquadron";
import {commandShip} from  "./templates/commandShip";
import {fighterSquadron} from  "./templates/fighterSquadron";
import {scout} from  "./templates/scout";
import {shieldBoat} from  "./templates/shieldBoat";
import {stealthShip} from  "./templates/stealthShip";
import { miningBarge } from "./templates/miningBarge";


export const unitTemplates: TemplateCollection<UnitTemplate> =
{
  [battleCruiser.type]: battleCruiser,
  [commandShip.type]: commandShip,
  [stealthShip.type]: stealthShip,
  [scout.type]: scout,
  [bomberSquadron.type]: bomberSquadron,
  [fighterSquadron.type]: fighterSquadron,
  [shieldBoat.type]: shieldBoat,
  [miningBarge.type]: miningBarge,
};
