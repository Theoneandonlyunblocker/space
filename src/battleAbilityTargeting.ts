
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";

import Unit from "./Unit";
import Battle from "./Battle";

export function getTargetsForAllAbilities(battle: Battle, user: Unit)
{
  // does this ever happen?
  if (!user || !battle.activeUnit)
  {
    throw new Error();
  }

  var allTargets:
  {
    [id: number]: AbilityTemplate[];
  } = {};

  var abilities = user.getAllAbilities();
  for (let i = 0; i < abilities.length; i++)
  {
    var ability = abilities[i];

    var targets = getPotentialTargets(battle, user, ability);

    for (let j = 0; j < targets.length; j++)
    {
      var target = targets[j];

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
function getPotentialTargets(battle: Battle, user: Unit, ability: AbilityTemplate): Unit[]
{
  const targetsInRange = ability.getPossibleTargets(user, battle);

  const targets = targetsInRange.filter(isTargetableFilterFN);

  return targets;
}
