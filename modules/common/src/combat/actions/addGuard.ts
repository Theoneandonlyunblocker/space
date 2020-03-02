import { Unit } from "core/src/unit/Unit";
import { CombatAction } from "core/src/combat/CombatAction";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { GuardCoverage } from "core/src/unit/GuardCoverage";
import { AdjustmentsPerAttribute } from "core/src/unit/UnitAttributes";
import { guardAmount } from "core/src/combat/core/primitives/guardAmount";
import { setGuardCoverage } from "../resultModifiers/setGuardCoverage";


export function addGuard(
  source: Unit,
  target: Unit,
  coverage: GuardCoverage,
  amount: {flat?: number; perAttribute?: AdjustmentsPerAttribute},
): CombatAction
{
  const flatAmount = amount.flat || 0;
  const finalGuardAmount = amount.perAttribute ?
    source.attributes.modifyValueByAttributes(flatAmount, amount.perAttribute) :
    flatAmount;

  const action = new CombatAction(
  {
    mainAction: makeSimpleModifier(guardAmount, {flat: finalGuardAmount}),
    source: source,
    target: target,
  });

  action.resultModifiers.push({modifier: setGuardCoverage, value: coverage});

  return action;
}
