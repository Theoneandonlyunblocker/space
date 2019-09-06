import {Battle} from "src/battle/Battle";
import {Unit} from "src/unit/Unit";

import
{
  ExecutedEffectsResult,
} from "src/templateinterfaces/ExecutedEffectsResult";


export type AbilityEffectActionWithData<T> = (
  data: T,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult
) => void;
