import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { allCoreCombatPhases, CorePhase } from "../coreCombatPhases";
import { BattleWideCombatActionListener } from "../../CombatActionListener";
import { beforeMainPhase } from "../phases/beforeMainPhase";
import { removeAllGuardFromUser } from "../actions/removeAllGuardFromUser";


export const removeGuardOnAbilityUse: BattleWideCombatActionListener<CorePhase> =
{
  key: "removeGuardOnAbilityUse",
  phasesToApplyTo: new Set(allCoreCombatPhases),
  flagsWhichTrigger: [coreCombatActionFlags.ability],
  flagsWhichPrevent: [coreCombatActionFlags.preserveUserGuard],
  onAdd: (action, combatManager) =>
  {
    combatManager.addAction(beforeMainPhase, removeAllGuardFromUser(action.source));
  },
};
