import { CombatActionModifier } from "../../CombatActionModifier";
import { actionPoints } from "../primitives/actionPoints";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";


export function removeActionPoints(amount: Partial<FlatAndMultiplierAdjustment>): CombatActionModifier
{
  return {
    primitives:
    {
      [actionPoints.key]:
      {
        primitive: actionPoints,
        value: amount,
      },
    },
  };
}
