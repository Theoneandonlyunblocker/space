import {Star} from "../Star";
import {Player} from "../Player";

export interface StarScripts
{
  onOwnerChange: (star: Star, oldOwner: Player, newOwner: Player) => void;
}
