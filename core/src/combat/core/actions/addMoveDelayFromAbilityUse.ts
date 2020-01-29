import { CombatAction } from "../../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { addMoveDelay } from "../modifiers/addMoveDelay";


export function addMoveDelayFromAbilityUse(
  user: Unit,
  baseDelay: number,
): CombatAction
{
  const action = new CombatAction(
  {
    mainAction: addMoveDelay({flat: baseDelay}),
    source: user,
    target: user,
  });

  return action;
}
