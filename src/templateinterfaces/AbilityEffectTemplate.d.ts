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
  ExecutedEffectsResult,
} from "./AbilityEffectAction";
import {BattleVfxTemplate} from "./BattleVfxTemplate";

export type AbilityEffectTrigger = (
  user: Unit,
  target: Unit,
  battle: Battle,
  executedEffectsResult: ExecutedEffectsResult,
  sourceStatusEffect: StatusEffect | null,
) => boolean;

export interface AbilityEffectTemplate
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
  vfx?: BattleVfxTemplate;

  /**
   * called for each unit affected by parent effect
   * user: parent user, target: unit in parent area
   */
  attachedEffects?: AbilityEffectTemplate[];
}

export interface AbilityMainEffectTemplate extends AbilityEffectTemplate
{
  vfx: BattleVfxTemplate;
  getDisplayDataForTarget: GetUnitsInAreaFN<AbilityTargetDisplayDataById>;
}
