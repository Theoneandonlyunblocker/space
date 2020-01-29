import { CombatActionModifier } from "../../CombatActionModifier";
import { moveDelay } from "../primitives/moveDelay";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";


export function addMoveDelay(amount: Partial<FlatAndMultiplierAdjustment>): CombatActionModifier
{
  return {
    primitives:
    {
      [moveDelay.key]:
      {
        primitive: moveDelay,
        value: amount,
      },
    },
  };
}
