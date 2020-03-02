import { CombatAction } from "../../CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { moveDelay } from "../primitives/moveDelay";
import { coreCombatActionFlags } from "../coreCombatActionFlags";


export function addMoveDelay(
  baseDelay: number,
  source?: Unit,
  target?: Unit,
): CombatAction
{
  const action = new CombatAction(
  {
    mainAction: makeSimpleModifier(moveDelay, {flat: baseDelay}, [coreCombatActionFlags.moveDelay]),
    source: source,
    target: target,
  });

  return action;
}
