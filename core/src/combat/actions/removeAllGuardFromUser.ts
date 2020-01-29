import { CombatAction } from "../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { addGuardAmount } from "../modifiers/addGuardAmount";


export function removeAllGuardFromUser(
  user: Unit,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: addGuardAmount({flat: -user.battleStats.guardAmount}),
    source: user,
    target: user,
  });
}
