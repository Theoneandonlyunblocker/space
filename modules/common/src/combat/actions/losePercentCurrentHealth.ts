import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { addHealthLoss } from "../modifiers/addHealthLoss";


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
    mainAction: addHealthLoss({flat: target.currentHealth * percentage}),
    source: target,
    target: target,
  });
}
