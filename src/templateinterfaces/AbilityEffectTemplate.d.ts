import BattleSFXTemplate from "./BattleSFXTemplate";
import
{
  AbilityEffectAction,
  ExecutedEffectsResult
} from "./AbilityEffectAction";

import Unit from "../Unit";
import Battle from "../Battle";
import
{
  GetUnitsInAreaFN
} from "../targeting";

export type AbilityEffectTrigger = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult
) => boolean;

export declare interface AbilityEffectTemplate
{
  id: string;

  getUnitsInArea: GetUnitsInAreaFN;
  executeAction: AbilityEffectAction;

  trigger?: AbilityEffectTrigger;
  sfx?: BattleSFXTemplate;

  // called after parent effect with same user and effect target
  attachedEffects?: AbilityEffectTemplate[];
}

export declare interface AbilityMainEffectTemplate extends AbilityEffectTemplate
{
  sfx: BattleSFXTemplate;
}
