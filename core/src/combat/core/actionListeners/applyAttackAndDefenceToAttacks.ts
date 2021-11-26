import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { physicalDamage } from "../primitives/physicalDamage";
import { allCoreCombatPhases, CorePhase } from "../coreCombatPhases";
import { BattleWideCombatActionListener } from "../../CombatActionListener";


export const applyAttackAndDefenceToAttacks: BattleWideCombatActionListener<CorePhase> =
{
  key: "applyAttackAndDefenceToAttacks",
  phasesToApplyTo: new Set(allCoreCombatPhases),
  flagsWhichTrigger: [coreCombatActionFlags.attack],
  onAdd: (action, combatManager) =>
  {
    action.modifiers.push(modifyPrimitiveByAttributes(
      physicalDamage,
      action.source,
      {
        attack: {multiplicativeMultiplierPerPoint: 0.1},
      },
    ));

    action.modifiers.push(modifyPrimitiveByAttributes(
      physicalDamage,
      action.target,
      {
        defence: {multiplicativeMultiplierPerPoint: -0.045},
      }
    ));
  },
};
