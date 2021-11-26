import { coreCombatActionFlags } from "../coreCombatActionFlags";
import { modifyPrimitiveByAttributes } from "../modifiers/modifyPrimitiveByAttributes";
import { moveDelay } from "../primitives/moveDelay";
import { allCoreCombatPhases, CorePhase } from "../coreCombatPhases";
import { BattleWideCombatActionListener } from "../../CombatActionListener";


export const applySpeedToMoveDelay: BattleWideCombatActionListener<CorePhase> =
{
  key: "applySpeedToMoveDelay",
  phasesToApplyTo: new Set(allCoreCombatPhases),
  flagsWhichTrigger: [coreCombatActionFlags.moveDelay],
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
