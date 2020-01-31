import { CombatActionListener } from "../../CombatPhaseInfo";
import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { guardPhysicalDamageReduction } from "../modifiers/guardPhysicalDamageReduction";
import { CorePhase } from "../coreCombatPhases";


export const applyGuardDamageReductionToAttacks: CombatActionListener<CorePhase> =
{
  key: "applyGuardDamageReductionToAttacks",
  flagsToListenTo: [coreCombatActionFlags.attack],
  onAdd: (action, combatManager) =>
  {
    if (action.target.battleStats.guardAmount)
    {
      action.modifiers.push(guardPhysicalDamageReduction(action.target.battleStats.guardAmount));
    }
  },
};
