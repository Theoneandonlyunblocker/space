import
{
  AbilityTargetDisplayDataById,
} from "./AbilityTargetDisplayData";
import {Battle} from "../battle/Battle";
import {Unit} from "../unit/Unit";

import {CombatAbilityTemplate} from "../templateinterfaces/CombatAbilityTemplate";


export function getAbilityTargetDisplayData(
  battle: Battle,
  ability: CombatAbilityTemplate,
  user: Unit,
  target: Unit,
): AbilityTargetDisplayDataById
{
  return ability.getDisplayDataForTarget(user, target, battle);

  // TODO 2020.02.25 |
  // const abilityEffects: AbilityEffectTemplate[] = [ability.mainEffect];
  // if (ability.secondaryEffects)
  // {
  //   abilityEffects.push(...ability.secondaryEffects.filter(secondaryEffect =>
  //   {
  //     return Boolean(secondaryEffect.getDisplayDataForTarget);
  //   }));
  // }

  // const allDisplayDataById = abilityEffects.map(abilityEffect =>
  // {
  //   return abilityEffect.getDisplayDataForTarget(user, target, battle);
  // });

  // const mergedDisplayDataById = mergeAbilityTargetDisplayDataById(...allDisplayDataById);

  // return mergedDisplayDataById;
}

export
{
  getTargetsForAllAbilities,
} from "./battleAbilityTargeting";
