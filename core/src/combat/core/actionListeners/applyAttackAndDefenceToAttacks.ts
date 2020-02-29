import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { physicalDamage } from "../primitives/physicalDamage";
import { CorePhase } from "../coreCombatPhases";
import { CombatActionListener } from "../../CombatActionListener";


export const applyAttackAndDefenceToAttacks: CombatActionListener<CorePhase> =
{
  key: "applyAttackAndDefenceToAttacks",
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
