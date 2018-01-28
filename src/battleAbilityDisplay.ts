import
{
  AbilityTargetDisplayDataById,
  mergeAbilityTargetDisplayDataById,
} from "./AbilityTargetDisplayData";
import Battle from "./Battle";
import Unit from "./Unit";

import {AbilityEffectTemplate} from "./templateinterfaces/AbilityEffectTemplate";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";


export function getAbilityTargetDisplayData(
  battle: Battle,
  ability: AbilityTemplate,
  user: Unit,
  target: Unit,
): AbilityTargetDisplayDataById
{
  const abilityEffects: AbilityEffectTemplate[] = [ability.mainEffect];
  if (ability.secondaryEffects)
  {
    abilityEffects.push(...ability.secondaryEffects.filter(secondaryEffect =>
    {
      return Boolean(secondaryEffect.getDisplayDataForTarget);
    }));
  }

  const allDisplayDataById = abilityEffects.map(abilityEffect =>
  {
    return abilityEffect.getDisplayDataForTarget(user, target, battle);
  });

  const mergedDisplayDataById = mergeAbilityTargetDisplayDataById(...allDisplayDataById);

  return mergedDisplayDataById;
}

export
{
  getTargetsForAllAbilities
} from "./battleAbilityTargeting";
