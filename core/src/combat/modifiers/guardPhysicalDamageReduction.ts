import { CombatActionModifier } from "../CombatActionModifier";
import { physicalDamage } from "../primitives/physicalDamage";


export function guardPhysicalDamageReduction(
  guardAmount: number,
): CombatActionModifier
{
  // 0 guard: 1.0x damage taken
  // 100+ guard: 0.5x damage taken
  const adjustedGuardAmount = Math.min(guardAmount, 100);
  const damageMultiplier = 1 - adjustedGuardAmount / 200;

  return {
    primitives:
    {
      [physicalDamage.key]:
      {
        primitive: physicalDamage,
        value: {multiplicativeMultiplier: damageMultiplier},
      },
    },
  };
}
