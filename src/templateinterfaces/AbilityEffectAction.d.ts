import Battle from "../Battle";
import StatusEffect from "../StatusEffect";
import Unit from "../Unit";

export declare interface ExecutedEffectsResult
{
  [id: string]: any;
}

export declare type AbilityEffectAction = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
  sourceStatusEffect: StatusEffect | null,
) => void;
