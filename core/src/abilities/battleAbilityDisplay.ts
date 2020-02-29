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
}

export
{
  getTargetsForAllAbilities,
} from "./battleAbilityTargeting";
