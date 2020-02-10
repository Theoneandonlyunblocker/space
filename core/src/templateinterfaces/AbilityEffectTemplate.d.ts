import
{
  AbilityTargetDisplayDataById,
} from "../abilities/AbilityTargetDisplayData";
import {Battle} from "../battle/Battle";
import {Unit} from "../unit/Unit";
import
{
  GetUnitsInAreaFN,
} from "../abilities/targeting";

import
{
  AbilityEffectAction,
} from "./AbilityEffectAction";
import {BattleVfxTemplate} from "./BattleVfxTemplate";
import {ExecutedEffectsResult} from "./ExecutedEffectsResult";

export type AbilityEffectTrigger = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
) => boolean;


// TODO 2019.08.23 | plug in generics to members
export interface AbilityEffectTemplate<EffectId extends string = any, R extends ExecutedEffectsResult = any>
{
  // TODO 2019.08.23 | might have to go through all these and make sure they're prefixed by source ability/effect to avoid clobbering
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
  vfx?: BattleVfxTemplate<EffectId, R>;

  /**
   * called for each unit affected by parent effect
   * user: parent user, target: unit in parent area
   */
  attachedEffects?: AbilityEffectTemplate[];
}

export interface AbilityMainEffectTemplate<EffectId extends string = any, R extends ExecutedEffectsResult = any> extends AbilityEffectTemplate<EffectId, R>
{
  vfx: BattleVfxTemplate<EffectId, R>;
  getDisplayDataForTarget: GetUnitsInAreaFN<AbilityTargetDisplayDataById>;
}
