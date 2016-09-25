import Unit from "../Unit";
import Battle from "../Battle";

declare interface AbilityEffectAction
{
  (user: Unit, target: Unit, battle: Battle): void;
}

// declare type AbilityEffectAction = (user: Unit, target: Unit, battle: Battle) => void;

export default AbilityEffectAction
