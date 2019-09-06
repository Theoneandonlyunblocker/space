import {Battle} from "../battle/Battle";
import {StatusEffect} from "../unit/StatusEffect";
import {Unit} from "../unit/Unit";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export type AbilityEffectAction = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
  sourceStatusEffect: StatusEffect | null,
) => void;
