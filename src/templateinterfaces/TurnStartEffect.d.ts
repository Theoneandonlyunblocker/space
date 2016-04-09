import Unit from "../Unit.ts";

declare interface TurnStartEffect
{
  (unit: Unit): void;
}

export default TurnStartEffect;
