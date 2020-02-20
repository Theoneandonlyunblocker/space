import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { FlatAndMultiplierAdjustment } from "core/src/generic/FlatAndMultiplierAdjustment";
import { CombatActionModifier } from "core/src/combat/CombatActionModifier";


export function makeSimpleModifier(
  primitive: CombatActionPrimitiveTemplate<number>,
  amount: Partial<FlatAndMultiplierAdjustment>,
  flags?: string[],
): CombatActionModifier
{
  return {
    primitives:
    {
      [primitive.key]:
      {
        primitive: primitive,
        value: amount,
      },
    },
    flags: flags ? new Set(flags) : undefined,
  };
}
