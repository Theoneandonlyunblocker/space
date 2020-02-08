import { CombatAction } from "../../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { removeActionPoints } from "../modifiers/removeActionPoints";


export function removeActionPointsFromAbilityUse(
  user: Unit,
  amount: number,
): CombatAction
{
  const action = new CombatAction(
  {
    mainAction: removeActionPoints({flat: amount}),
    source: user,
    target: user,
  });

  return action;
}
