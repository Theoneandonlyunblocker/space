import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { CorePhase } from "../coreCombatPhases";
import { CombatActionListener } from "../../CombatActionListener";
import { beforeMainPhase } from "../phases/beforeMainPhase";
import { removeAllGuardFromUser } from "../actions/removeAllGuardFromUser";


export const removeGuardOnAbilityUse: CombatActionListener<CorePhase> =
{
  key: "removeGuardOnAbilityUse",
  flagsWhichTrigger: [coreCombatActionFlags.ability],
  flagsWhichPrevent: [coreCombatActionFlags.preserveUserGuard],
  onAdd: (action, combatManager) =>
  {
    combatManager.addAction(beforeMainPhase, removeAllGuardFromUser(action.source));
  },
};
