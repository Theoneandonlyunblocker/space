import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatAction } from "core/src/combat/CombatAction";
import { Unit } from "core/src/unit/Unit";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { infestationAmount } from "../primitives/infestationAmount";


export function increaseInfestationAmount(
  source: Unit,
  target: Unit,
  amount: Partial<FlatAndMultiplierAdjustment>,
): CombatAction
{
  return new CombatAction(
  {
    mainAction: makeSimpleModifier(infestationAmount, amount),
    source: source,
    target: target,
  });
}
