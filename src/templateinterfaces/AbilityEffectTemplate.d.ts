import
{
  AbilityTargetDisplayDataById,
} from "../AbilityTargetDisplayData";
import {Battle} from "../Battle";
import {StatusEffect} from "../StatusEffect";
import {Unit} from "../Unit";
import
{
  GetUnitsInAreaFN,
} from "../targeting";

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
  sourceStatusEffect: StatusEffect | null,
) => boolean;


// TODO 2019.08.23 | plug in generics to members
export interface AbilityEffectTemplate<EffectId extends string = any, R extends ExecutedEffectsResult = any>
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
