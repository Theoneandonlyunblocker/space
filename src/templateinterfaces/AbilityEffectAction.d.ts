import {Battle} from "../Battle";
import {StatusEffect} from "../StatusEffect";
import {Unit} from "../Unit";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export type AbilityEffectAction = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
  sourceStatusEffect: StatusEffect | null,
) => void;
