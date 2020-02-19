import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatActionModifier } from "core/src/combat/CombatActionModifier";
import { healthRestoration } from "../primitives/healthRestoration";


export function addHealthRestoration(amount: Partial<FlatAndMultiplierAdjustment>): CombatActionModifier
{
  return {
    primitives:
    {
      [healthRestoration.key]:
      {
        primitive: healthRestoration,
        value: amount,
      },
    },
  };
}
