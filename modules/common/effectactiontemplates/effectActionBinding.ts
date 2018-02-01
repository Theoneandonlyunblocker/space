import Battle from "../../../src/Battle";
import Unit from "../../../src/Unit";

import
{
  AbilityEffectAction,
  ExecutedEffectsResult,
} from "../../../src/templateinterfaces/AbilityEffectAction";


export type UnboundEffectAction<T> = (
  data: T,
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult
) => void;

// so we preserve typing for bound data
// https://github.com/Microsoft/TypeScript/issues/212
export function bindEffectActionData<T>(toBind: UnboundEffectAction<T>, data: T): AbilityEffectAction
{
  return toBind.bind(null, data);
}
