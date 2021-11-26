import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { magicalDamage } from "../primitives/magicalDamage";
import { allCoreCombatPhases, CorePhase } from "../coreCombatPhases";
import { BattleWideCombatActionListener } from "../../CombatActionListener";


export const applyIntelligenceToAttacks: BattleWideCombatActionListener<CorePhase> =
{
  key: "applyIntelligenceToAttacks",
  phasesToApplyTo: new Set(allCoreCombatPhases),
  flagsWhichTrigger: [coreCombatActionFlags.attack],
  onAdd: (action, combatManager) =>
  {
    action.modifiers.push(modifyPrimitiveByAttributes(
      magicalDamage,
      action.source,
      {
        intelligence: {multiplicativeMultiplierPerPoint: 0.1},
      },
    ));

    action.modifiers.push(modifyPrimitiveByAttributes(
      magicalDamage,
      action.target,
      {
        intelligence: {multiplicativeMultiplierPerPoint: -0.045},
      }
    ));
  },
};
