import Star from "../Star.ts";
import Player from "../Player.ts";

declare interface RoutineAdjustment
{
  target: Star | Player;
  multiplier: number;
}

export default RoutineAdjustment;
