import { CombatActionListener } from "../CombatPhaseInfo";
import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { moveDelay } from "../primitives/moveDelay";


export const applySpeedToMoveDelay: CombatActionListener<never> =
{
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
