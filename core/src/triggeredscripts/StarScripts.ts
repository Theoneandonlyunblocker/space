import {Star} from "../map/Star";
import {Player} from "../player/Player";

export interface StarScripts
{
  onOwnerChange: (star: Star, oldOwner: Player, newOwner: Player) => void;
}
