import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatActionModifier } from "core/src/combat/CombatActionModifier";
import { healthLoss } from "../primitives/healthLoss";


export function addHealthLoss(amount: Partial<FlatAndMultiplierAdjustment>): CombatActionModifier
{
  return {
    primitives:
    {
      [healthLoss.key]:
      {
        primitive: healthLoss,
        value: amount,
      },
    },
  };
}
