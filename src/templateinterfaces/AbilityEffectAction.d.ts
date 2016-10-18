import Unit from "../Unit";
import Battle from "../Battle";

export declare interface ExecutedEffectsResult
{
  [id: string]: any;
}

export declare interface AbilityEffectAction
{
  (user: Unit, target: Unit, battle: Battle, executedEffectsResult: ExecutedEffectsResult): void;
}
