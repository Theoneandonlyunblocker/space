import {Player} from "../player/Player";

export interface PlayerScripts
{
  onDeath: ((player: Player) => void);
  onResourcesChange: ((player: Player) => void);
}
