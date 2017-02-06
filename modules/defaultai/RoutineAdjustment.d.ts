import Player from "../../src/Player";
import Star from "../../src/Star";

declare interface RoutineAdjustment
{
  target: Star | Player;
  multiplier: number;
}

export default RoutineAdjustment;
