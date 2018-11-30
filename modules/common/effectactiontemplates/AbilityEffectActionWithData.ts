import Battle from "../../../src/Battle";
import Unit from "../../../src/Unit";

import
{
  ExecutedEffectsResult,
} from "../../../src/templateinterfaces/AbilityEffectAction";


export type AbilityEffectActionWithData<T> = (
  data: T,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult
) => void;
