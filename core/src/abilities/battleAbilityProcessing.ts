import {CombatAbilityTemplate} from "../templateinterfaces/CombatAbilityTemplate";

import {Battle} from "../battle/Battle";
import {GuardCoverage} from "../unit/GuardCoverage";
import {Unit} from "../unit/Unit";

// TODO 2020.02.08 | move
export interface AbilityUseData
{
  ability: CombatAbilityTemplate;
  user: Unit;
  intendedTarget: Unit;
  actualTarget?: Unit;
}

// TODO 2020.02.08 | move
export function getTargetOrGuard(battle: Battle, abilityUseData: AbilityUseData): Unit
{
  if (abilityUseData.ability.targetCannotBeDiverted)
  {
    return abilityUseData.intendedTarget;
  }

  const guarders = getGuarders(battle, abilityUseData);
  const guardersSortedByGuardAmount = guarders.sort((a, b) =>
  {
    return a.battleStats.guardAmount - b.battleStats.guardAmount;
  });

  for (let i = 0; i < guardersSortedByGuardAmount.length; i++)
  {
    const guardRoll = Math.random() * 100;
    if (guardRoll <= guardersSortedByGuardAmount[i].battleStats.guardAmount)
    {
      return guardersSortedByGuardAmount[i];
    }
  }

  return abilityUseData.intendedTarget;
}

function getGuarders(battle: Battle, abilityUseData: AbilityUseData): Unit[]
{
  const userSide = abilityUseData.user.battleStats.side;
  const targetSide = abilityUseData.intendedTarget.battleStats.side;

  if (userSide === targetSide)
  {
    return [];
  }

  const allEnemies = battle.getUnitsForSide(targetSide);

  const guarders = allEnemies.filter(unit =>
  {
    return canUnitGuardTarget(unit, abilityUseData.intendedTarget);
  });

  return guarders;
}
function canUnitGuardTarget(unit: Unit, intendedTarget: Unit)
{
  if (unit.battleStats.guardAmount > 0 && unit.isTargetable())
  {
    if (unit.battleStats.guardCoverage === GuardCoverage.All)
    {
      return true;
    }
    else if (unit.battleStats.guardCoverage === GuardCoverage.Row)
    {
      // same row
      if (unit.battleStats.position[0] === intendedTarget.battleStats.position[0])
      {
        return true;
      }
    }
  }

  return false;
}
