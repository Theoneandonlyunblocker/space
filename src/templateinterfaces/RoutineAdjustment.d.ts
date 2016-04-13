import Star from "../Star";
import Player from "../Player";

declare interface RoutineAdjustment
{
  target: Star | Player;
  multiplier: number;
}

export default RoutineAdjustment;
