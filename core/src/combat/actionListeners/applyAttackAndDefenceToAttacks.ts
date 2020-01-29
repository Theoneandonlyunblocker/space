import { CombatActionListener } from "../CombatPhaseInfo";
import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { physicalDamage } from "../primitives/physicalDamage";


export const applyAttackAndDefenceToAttacks: CombatActionListener<never> =
{
  flagsToListenTo: [coreCombatActionFlags.attack],
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
