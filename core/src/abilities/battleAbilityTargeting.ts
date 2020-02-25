import {Battle} from "../battle/Battle";
import {Unit} from "../unit/Unit";
import { CombatAbilityTemplate } from "../templateinterfaces/CombatAbilityTemplate";


export function getTargetsForAllAbilities(battle: Battle, user: Unit)
{
  // does this ever happen?
  if (!user || !battle.activeUnit)
  {
    throw new Error();
  }

  const allTargets:
  {
    [id: number]: CombatAbilityTemplate[];
  } = {};

  const abilities = user.getAllAbilities();
  for (let i = 0; i < abilities.length; i++)
  {
    const ability = abilities[i];

    const targets = getPotentialTargets(battle, user, ability);

    for (let j = 0; j < targets.length; j++)
    {
      const target = targets[j];

      if (!allTargets[target.id])
      {
        allTargets[target.id] = [];
      }

      allTargets[target.id].push(ability);
    }
  }

  return allTargets;
}

function isTargetableFilterFN(unit: Unit)
{
  return unit && unit.isTargetable();
}
function getPotentialTargets(battle: Battle, user: Unit, ability: CombatAbilityTemplate): Unit[]
{
  const targetsInRange = ability.getPossibleTargets(user, battle);

  const targets = targetsInRange.filter(isTargetableFilterFN);

  return targets;
}
