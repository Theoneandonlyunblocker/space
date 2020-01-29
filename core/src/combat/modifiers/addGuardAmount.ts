import { CombatActionModifier } from "../CombatActionModifier";
import { guardAmount } from "../primitives/guardAmount";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";


export function addGuardAmount(amount: Partial<FlatAndMultiplierAdjustment>): CombatActionModifier
{
  return {
    primitives:
    {
      [guardAmount.key]:
      {
        primitive: guardAmount,
        value: amount,
      },
    },
  };
}
