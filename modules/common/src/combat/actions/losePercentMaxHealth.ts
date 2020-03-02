import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { rawHealthLoss } from "../primitives/rawHealthLoss";


export function losePercentMaxHealth(
  source: Unit,
  target: Unit,
  /**
   * 0.5 = 50%
   */
  percentage: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(rawHealthLoss, {flat: target.maxHealth * percentage}),
    source: source,
    target: target,
  });
}
