import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { guardPhysicalDamageReduction } from "../modifiers/guardPhysicalDamageReduction";
import { allCoreCombatPhases, CorePhase } from "../coreCombatPhases";
import { BattleWideCombatActionListener } from "../../CombatActionListener";


export const applyGuardDamageReductionToAttacks: BattleWideCombatActionListener<CorePhase> =
{
  key: "applyGuardDamageReductionToAttacks",
  phasesToApplyTo: new Set(allCoreCombatPhases),
  flagsWhichTrigger: [coreCombatActionFlags.attack],
  onAdd: (action, combatManager) =>
  {
    if (action.target.battleStats.guardAmount)
    {
      action.modifiers.push(guardPhysicalDamageReduction(action.target.battleStats.guardAmount));
    }
  },
};
