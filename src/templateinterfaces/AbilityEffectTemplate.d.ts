import
{
  AbilityEffectAction,
  ExecutedEffectsResult,
} from "./AbilityEffectAction";
import BattleSFXTemplate from "./BattleSFXTemplate";

import
{
  AbilityTargetDisplayDataById,
} from "../AbilityTargetDisplayData";
import Battle from "../Battle";
import StatusEffect from "../StatusEffect";
import Unit from "../Unit";
import
{
  GetUnitsInAreaFN,
} from "../targeting";

export type AbilityEffectTrigger = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
  sourceStatusEffect: StatusEffect | null,
) => boolean;

export declare interface AbilityEffectTemplate
{
  id: string;

  /**
   * units effect action is executed on
   */
  getUnitsInArea: GetUnitsInAreaFN;
  /**
   * display purposes only
   */
  getDisplayDataForTarget?: GetUnitsInAreaFN<AbilityTargetDisplayDataById>;
  executeAction: AbilityEffectAction;

  trigger?: AbilityEffectTrigger;
  sfx?: BattleSFXTemplate;

  /**
   * called for each unit affected by parent effect
   * user: parent user, target: unit in parent area
   */
  attachedEffects?: AbilityEffectTemplate[];
}

export declare interface AbilityMainEffectTemplate extends AbilityEffectTemplate
{
  sfx: BattleSFXTemplate;
  getDisplayDataForTarget: GetUnitsInAreaFN<AbilityTargetDisplayDataById>;
}
