import {Battle} from "../battle/Battle";
import {Unit} from "../unit/Unit";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";


export type AbilityEffectAction = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
) => void;
