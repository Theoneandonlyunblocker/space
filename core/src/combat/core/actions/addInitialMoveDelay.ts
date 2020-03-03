import { CombatAction } from "../../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { moveDelay } from "../primitives/moveDelay";
import { coreCombatActionFlags } from "../coreCombatActionFlags";


export function addInitialMoveDelay(
  unit: Unit,
): CombatAction
{
  const baseInitialDelay = 30;

  const action = new CombatAction(
  {
    mainAction: makeSimpleModifier(moveDelay, {flat: baseInitialDelay}, [coreCombatActionFlags.moveDelay]),
    source: unit,
    target: unit,
  });

  return action;
}
