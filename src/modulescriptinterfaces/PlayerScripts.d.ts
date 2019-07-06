import {Player} from "../Player";

export interface PlayerScripts
{
  onDeath: ((player: Player) => void);
}
