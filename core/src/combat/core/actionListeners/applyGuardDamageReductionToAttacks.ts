import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { guardPhysicalDamageReduction } from "../modifiers/guardPhysicalDamageReduction";
import { CorePhase } from "../coreCombatPhases";
import { CombatActionListener } from "../../CombatActionListener";


export const applyGuardDamageReductionToAttacks: CombatActionListener<CorePhase> =
{
  key: "applyGuardDamageReductionToAttacks",
  flagsWhichTrigger: [coreCombatActionFlags.attack],
  onAdd: (action, combatManager) =>
  {
    if (action.target.battleStats.guardAmount)
    {
      action.modifiers.push(guardPhysicalDamageReduction(action.target.battleStats.guardAmount));
    }
  },
};
