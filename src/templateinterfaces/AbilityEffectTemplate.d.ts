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

  // called for each unit affected by parent effect
  // user: parent user, target: unit in parent area
  attachedEffects?: AbilityEffectTemplate[];
}

export declare interface AbilityMainEffectTemplate extends AbilityEffectTemplate
{
  sfx: BattleSFXTemplate;
}
