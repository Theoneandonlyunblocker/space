import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "../modifiers/makeSimpleModifier";
import { healing } from "../primitives/healing";


export function healTarget(
  source: Unit,
  target: Unit,
  amount: number,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(healing, {flat: amount}),
    source: source,
    target: target,
  });
}
