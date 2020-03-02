import { CombatAction } from "../../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "../modifiers/makeSimpleModifier";
import { guardAmount } from "../primitives/guardAmount";


export function removeAllGuardFromUser(
  user: Unit,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(guardAmount, {flat: -Infinity}),
    source: user,
    target: user,
  });
}
