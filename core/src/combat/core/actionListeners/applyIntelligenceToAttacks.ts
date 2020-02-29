import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { magicalDamage } from "../primitives/magicalDamage";
import { CorePhase } from "../coreCombatPhases";
import { CombatActionListener } from "../../CombatActionListener";


export const applyIntelligenceToAttacks: CombatActionListener<CorePhase> =
{
  key: "applyIntelligenceToAttacks",
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
