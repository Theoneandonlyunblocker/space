import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "../modifiers/makeSimpleModifier";
import { battleEvaluationChange } from "../primitives/battleEvaluationChange";


export function changeBattleEvaluation(
  amount: number,
  source?: Unit,
  target?: Unit,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(battleEvaluationChange, {flat: amount}),
    source: source,
    target: target,
  });
}
