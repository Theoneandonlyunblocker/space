import Battle from "./Battle";
import Unit from "./Unit";
import
{
  getUnitsInEffectArea,
} from "./battleAbilityProcessing";
import {AbilityEffectTemplate} from "./templateinterfaces/AbilityEffectTemplate";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";


export enum AbilityTargetType
{
  Primary,
  Secondary,
  Random,
}

export type AbilityTargetTypeById =
{
  [id: number]: AbilityTargetType;
};

export function getUnitsInAbilityArea(
  battle: Battle,
  ability: AbilityTemplate,
  user: Unit,
  target: Unit,
): Unit[]
{
  const includedUnitsById:
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
      includedUnitsById[unit.id] = unit;
    });
  });

  const units: Unit[] = [];
  for (let id in includedUnitsById)
  {
    units.push(includedUnitsById[id]);
  }

  return units;
}

export
{
  getTargetsForAllAbilities
} from "./battleAbilityTargeting";
