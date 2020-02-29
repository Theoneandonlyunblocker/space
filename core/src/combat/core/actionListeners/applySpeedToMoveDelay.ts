import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { moveDelay } from "../primitives/moveDelay";
import { CorePhase } from "../coreCombatPhases";
import { CombatActionListener } from "../../CombatActionListener";


export const applySpeedToMoveDelay: CombatActionListener<CorePhase> =
{
  key: "applySpeedToMoveDelay",
  flagsToListenTo: [coreCombatActionFlags.moveDelay],
  onAdd: (action, combatManager) =>
  {
    action.modifiers.push(modifyPrimitiveByAttributes(
      moveDelay,
      action.target,
      {
        speed: {multiplicativeMultiplierPerPoint: -0.05},
      },
    ));
  },
};
