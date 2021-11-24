import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { lifeLeech } from "../primitives/lifeLeech";


// TODO 2021.11.24 | should probably just be a resultmodifier
export function leechLife(
  unitLeeching: Unit,
  unitBeingLeechedFrom: Unit,
  /**
   * 0.5 = 50%
   */
  percentageLeeched: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(lifeLeech, {flat: percentageLeeched}),
    source: unitLeeching,
    target: unitBeingLeechedFrom,
  });
}
