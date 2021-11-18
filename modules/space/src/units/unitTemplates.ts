import {battleCruiser} from  "./templates/battleCruiser";
import {bomberSquadron} from  "./templates/bomberSquadron";
import {commandShip} from  "./templates/commandShip";
import {fighterSquadron} from  "./templates/fighterSquadron";
import {scout} from  "./templates/scout";
import {shieldBoat} from  "./templates/shieldBoat";
import {stealthShip} from  "./templates/stealthShip";
import { miningBarge } from "./templates/miningBarge";


export const unitTemplates =
{
  [battleCruiser.key]: battleCruiser,
  [commandShip.key]: commandShip,
  [stealthShip.key]: stealthShip,
  [scout.key]: scout,
  [bomberSquadron.key]: bomberSquadron,
  [fighterSquadron.key]: fighterSquadron,
  [shieldBoat.key]: shieldBoat,
  [miningBarge.key]: miningBarge,
};
