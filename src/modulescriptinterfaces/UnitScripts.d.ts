import {Player} from "../player/Player";
import {Unit} from "../unit/Unit";

export interface UnitScripts
{
  removeFromPlayer: ((unit: Unit) => void);
  onCapture: ((unit: Unit, oldPlayer: Player, newPlayer: Player) => void);
}
