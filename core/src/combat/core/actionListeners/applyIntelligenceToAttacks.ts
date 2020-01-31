import { CombatActionListener } from "../../CombatPhaseInfo";
import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { magicalDamage } from "../primitives/magicalDamage";
import { CorePhase } from "../coreCombatPhases";


export const applyIntelligenceToAttacks: CombatActionListener<CorePhase> =
{
  key: "applyIntelligenceToAttacks",
  flagsToListenTo: [coreCombatActionFlags.attack],
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
