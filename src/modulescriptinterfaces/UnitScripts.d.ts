import {Player} from "../Player";
import {Unit} from "../Unit";

export interface UnitScripts
{
  removeFromPlayer: ((unit: Unit) => void);
  onCapture: ((unit: Unit, oldPlayer: Player, newPlayer: Player) => void);
}
