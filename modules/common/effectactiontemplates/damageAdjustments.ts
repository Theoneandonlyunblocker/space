import DamageType from "../../../src/DamageType";
import Unit from "../../../src/Unit";

export function getAdjustedTroopSize(unit: Unit): number
{
  // used so unit will always counter with at least 1/3 strength it had before being attacked
  const minEffectiveHealth = Math.max(unit.currentHealth, unit.battleStats.lastHealthBeforeReceivingDamage / 3);

  const effectiveHealth = unit.isSquadron ?
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

export function getAttackDamageIncrease(unit: Unit, damageType: DamageType): number
{
  let attackStat: number;
  let attackFactor: number;

  switch (damageType)
  {
    case DamageType.physical:
    {
      attackStat = unit.attributes.attack;
      attackFactor = 0.1;
      break;
    }
    case DamageType.magical:
    {
      attackStat = unit.attributes.intelligence;
      attackFactor = 0.1;
      break;
    }
  }

  const adjustedTroopSize = getAdjustedTroopSize(unit);
  const increaseFromStats = attackStat * attackFactor;
  const damageIncrease = (1 + increaseFromStats) * adjustedTroopSize;

  return damageIncrease;
}

export function getReducedDamageFactor(unit: Unit, damageType: DamageType): number
{
  let defenceStat: number;
  let defenceFactor: number;
  let finalDamageMultiplier = 1;

  switch (damageType)
  {
    case DamageType.physical:
    {
      defenceStat = unit.attributes.defence;
      defenceFactor = 0.045;

      const guardAmount = Math.min(unit.battleStats.guardAmount, 100);
      finalDamageMultiplier = 1 - guardAmount / 200; // 1.0-0.5
      break;
    }
    case DamageType.magical:
    {
      defenceStat = unit.attributes.intelligence;
      defenceFactor = 0.045;
      break;
    }
  }

  const reductionFromStats = defenceStat * defenceFactor;
  const damageReduction = (1 - reductionFromStats) * finalDamageMultiplier;

  return damageReduction;
}

export function getAdjustedDamage(user: Unit, target: Unit,
  baseDamage: number, damageType: DamageType): number
{
  const dealtDamage = baseDamage * getAttackDamageIncrease(user, damageType);
  const reducedDamage = dealtDamage * getReducedDamageFactor(target, damageType);

  const clampedDamage = Math.min(reducedDamage, target.currentHealth);

  return clampedDamage;
}
