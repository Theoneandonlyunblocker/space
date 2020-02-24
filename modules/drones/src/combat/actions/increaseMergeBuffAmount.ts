import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatAction } from "core/src/combat/CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "modules/common/src/combat/modifiers/makeSimpleModifier";
import { mergeBuffAmount } from "../primitives/mergeBuffAmount";


export function increaseMergeBuffAmount(
  source: Unit,
  target: Unit,
  amount: Partial<FlatAndMultiplierAdjustment>,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(mergeBuffAmount, amount),
    source: source,
    target: target,
  });
}
