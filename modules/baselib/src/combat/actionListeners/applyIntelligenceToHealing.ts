import { CorePhase } from "core/src/combat/core/coreCombatPhases";
import { modifyPrimitiveByAttributes } from "core/src/combat/core/modifiers/modifyPrimitiveByAttributes";
import { combatActionFlags } from "../combatActionFlags";
import { healing } from "../primitives/healing";
import { CombatActionListener } from "core/src/combat/CombatActionListener";


export const applyIntelligenceToHealing: CombatActionListener<CorePhase> =
{
  key: "applyIntelligenceToHealing",
  flagsWhichTrigger: [combatActionFlags.heal],
  onAdd: (action, combatManager) =>
  {
    action.modifiers.push(modifyPrimitiveByAttributes(
      healing,
      action.source,
      {
        intelligence: {multiplicativeMultiplierPerPoint: 0.1},
      },
    ));
  },
};
