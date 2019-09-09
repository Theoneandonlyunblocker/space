import {Battle} from "core/src/battle/Battle";
import {Unit} from "core/src/unit/Unit";

import
{
  ExecutedEffectsResult,
} from "core/src/templateinterfaces/ExecutedEffectsResult";


export type AbilityEffectActionWithData<T> = (
  data: T,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult
) => void;
