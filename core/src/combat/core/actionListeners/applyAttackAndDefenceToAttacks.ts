import { CombatActionListener } from "../../CombatPhaseInfo";
import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { physicalDamage } from "../primitives/physicalDamage";
import { CorePhase } from "../coreCombatPhases";


export const applyAttackAndDefenceToAttacks: CombatActionListener<CorePhase> =
{
  key: "applyAttackAndDefenceToAttacks",
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
