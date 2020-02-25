import {CombatAbilityTemplate} from "../templateinterfaces/CombatAbilityTemplate";

import {Battle} from "../battle/Battle";
import {GuardCoverage} from "../unit/GuardCoverage";
import {Unit} from "../unit/Unit";

// TODO 2020.02.08 | rename / move
export interface AbilityUseData
{
  ability: CombatAbilityTemplate;
  user: Unit;
  intendedTarget: Unit;
  actualTarget?: Unit;
}

// TODO 2020.02.08 | rename / move
export function getTargetOrGuard(battle: Battle, abilityUseData: AbilityUseData): Unit
{
  if (abilityUseData.ability.targetCannotBeDiverted)
  {
    return abilityUseData.intendedTarget;
  }

  let guarding = getGuarders(battle, abilityUseData);

  guarding = guarding.sort((a, b) =>
  {
    return a.battleStats.guardAmount - b.battleStats.guardAmount;
  });

  for (let i = 0; i < guarding.length; i++)
  {
    const guardRoll = Math.random() * 100;
    if (guardRoll <= guarding[i].battleStats.guardAmount)
    {
      return guarding[i];
    }
  }

  return abilityUseData.intendedTarget;
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
