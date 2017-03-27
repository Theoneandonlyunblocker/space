import Battle from "./Battle";
import Unit from "./Unit";
import
{
  getUnitsInEffectArea,
} from "./battleAbilityProcessing";
import {AbilityEffectTemplate} from "./templateinterfaces/AbilityEffectTemplate";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";

export function getUnitsInAbilityArea(
  battle: Battle,
  ability: AbilityTemplate,
  user: Unit,
  target: Unit,
): Unit[]
{
  const includedUnitsByID:
  {
    [id: number]: Unit;
  } = {};

  const abilityEffects: AbilityEffectTemplate[] = [ability.mainEffect];
  if (ability.secondaryEffects)
  {
    abilityEffects.push(...ability.secondaryEffects);
  }

  abilityEffects.forEach(abilityEffect =>
  {
    getUnitsInEffectArea(abilityEffect, battle, user, target).forEach(unit =>
    {
      includedUnitsByID[unit.id] = unit;
    });
  });

  const units: Unit[] = [];
  for (let id in includedUnitsByID)
  {
    units.push(includedUnitsByID[id]);
  }

  return units;
}

export
{
  getTargetsForAllAbilities
} from "./battleAbilityTargeting";
