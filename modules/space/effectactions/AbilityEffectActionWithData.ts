import {Battle} from "core/battle/Battle";
import {Unit} from "core/unit/Unit";

import
{
  ExecutedEffectsResult,
} from "core/templateinterfaces/ExecutedEffectsResult";


export type AbilityEffectActionWithData<T> = (
  data: T,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult
) => void;
