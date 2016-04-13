import Unit from "../Unit";

declare interface TurnStartEffect
{
  (unit: Unit): void;
}

export default TurnStartEffect;
