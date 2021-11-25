import { Unit } from "core/src/unit/Unit";
import { CombatActionModifier } from "../../CombatActionModifier";
import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";


function getAdjustedTroopSize(unit: Unit): number
{
  // used so unit will always counter with at least 1/3 strength it had before being attacked
  const minEffectiveHealth = Math.max(unit.currentHealth, unit.battleStats.lastHealthBeforeReceivingDamage / 3);

  const effectiveHealth = unit.template.isSquadron ?
    minEffectiveHealth :
    Math.min(unit.maxHealth, minEffectiveHealth + unit.maxHealth * 0.2);

  if (effectiveHealth <= 500)
  {
    return effectiveHealth;
  }
  else if (effectiveHealth <= 2000)
  {
    return effectiveHealth / 2 + 250;
  }
  else
  {
    return effectiveHealth / 4 + 750;
  }
}

export function scalePrimitiveByTroopSize(
  primitiveToScale: CombatActionPrimitiveTemplate<number>,
  unit: Unit,
): CombatActionModifier
{
  const effectiveTroopSize = getAdjustedTroopSize(unit);

  return {
    primitives:
    {
      [primitiveToScale.key]:
      {
        primitive: primitiveToScale,
        value: {multiplicativeMultiplier: effectiveTroopSize},
      },
    },
  };
}
