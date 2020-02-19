import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatActionModifier } from "core/src/combat/CombatActionModifier";
import { poisonDamage } from "../primitives/poisonDamage";


export function addPoisonDamage(amount: Partial<FlatAndMultiplierAdjustment>): CombatActionModifier
{
  return {
    primitives:
    {
      [poisonDamage.key]:
      {
        primitive: poisonDamage,
        value: amount,
      },
    },
  };
}
