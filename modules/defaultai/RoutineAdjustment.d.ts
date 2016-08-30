import Star from "../../src/Star";
import Player from "../../src/Player";

declare interface RoutineAdjustment
{
  target: Star | Player;
  multiplier: number;
}

export default RoutineAdjustment;
