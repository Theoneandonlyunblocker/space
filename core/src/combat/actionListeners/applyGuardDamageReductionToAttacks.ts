import { CombatActionListener } from "../CombatPhaseInfo";
import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { guardPhysicalDamageReduction } from "../modifiers/guardPhysicalDamageReduction";


export const applyGuardDamageReductionToAttacks: CombatActionListener<never> =
{
  flagsToListenTo: [coreCombatActionFlags.attack],
  onAdd: (action, combatManager) =>
  {
    if (action.target.battleStats.guardAmount)
    {
      action.modifiers.push(guardPhysicalDamageReduction(action.target.battleStats.guardAmount));
    }
  },
};
