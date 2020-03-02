import { CombatAction } from "../../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "../modifiers/makeSimpleModifier";
import { actionPoints } from "../primitives/actionPoints";


export function removeActionPointsFromAbilityUse(
  user: Unit,
  amount: number,
): CombatAction
{
  const action = new CombatAction(
  {
    mainAction: makeSimpleModifier(actionPoints, {flat: -amount}),
    source: user,
    target: user,
  });

  return action;
}
