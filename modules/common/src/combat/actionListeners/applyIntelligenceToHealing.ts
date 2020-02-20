import { CombatActionListener } from "core/src/combat/CombatPhaseInfo";
import { CorePhase } from "core/src/combat/core/coreCombatPhases";
import { modifyPrimitiveByAttributes } from "core/src/combat/core/modifiers/modifyPrimitiveByAttributes";
import { combatActionFlags } from "../combatActionFlags";
import { healing } from "../primitives/healing";


// TODO 2020.02.20 | this needs to be registered somewhere
export const applyIntelligenceToHealing: CombatActionListener<CorePhase> =
{
  key: "applyIntelligenceToHealing",
  flagsToListenTo: [combatActionFlags.heal],
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
