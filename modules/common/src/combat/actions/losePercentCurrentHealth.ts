import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "../modifiers/makeSimpleModifier";
import { rawHealthLoss } from "../primitives/rawHealthLoss";


export function losePercentCurrentHealth(
  target: Unit,
  /**
   * 0.5 = 50%
   */
  percentage: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(rawHealthLoss, {flat: target.currentHealth * percentage}),
    source: target,
    target: target,
  });
}
