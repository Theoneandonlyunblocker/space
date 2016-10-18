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
  // called after parent effect with same user and effect target
  // nesting these wont work and wouldnt do anything anyway
  attachedEffects?: AbilityEffectTemplate[];
  sfx?: BattleSFXTemplate;
}
