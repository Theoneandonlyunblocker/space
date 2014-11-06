/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="battle.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="targeting.ts"/>

module Rance
{
  export function useAbility(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate)
  {

  }
  export function getPotentialTargets(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate): Unit[]
  {
    if (ability.targetRange === "self")
    {
      return [user];
    }

    if (ability.targetRange === "close")
    {
      var closestColumnPerSide =
      {
        side1: 1,
        side2: 0
      };

      if (user.battleStats.position[0] !==
        closestColumnPerSide[user.battleStats.side])
      {
        return [];
      }

      var oppositeSide = reverseSide(user.battleStats.side);

      return battle[oppositeSide][closestColumnPerSide[oppositeSide]].filter(Boolean);
    }

    var fleetsToTarget = getFleetsToTarget(battle, user, ability);

    return flatten2dArray(fleetsToTarget).filter(Boolean);


    throw new Error();
  }
  export function getFleetsToTarget(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate): Unit[][]
  {
    switch (ability.targetFleets)
    {
      case "all":
      {
        return battle.side1.concat(battle.side2);
      }
      case "ally":
      {
        return battle[user.battleStats.side];
      }
      case "enemy":
      {
        return battle[reverseSide(user.battleStats.side)];
      }
    }
  }
  export function getPotentialTargetsByPosition(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate): number[][]
  {
    var targets = getPotentialTargets(battle, user, ability);
    var targetPositions = [];

    for (var i = 0; i < targets.length; i++)
    {
      targetPositions.push(targets[i].battleStats.position);
    }

    return targetPositions;
  }
  export function getUnitsInAbilityArea(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate, target: number[]): Unit[]
  {
    var targetFleets = getFleetsToTarget(battle, user, ability);

    var inArea = ability.targetingFunction(targetFleets, target);

    return inArea.filter(Boolean);
  }

  export function getTargetsForAllAbilities(battle: Battle, user: Unit)
  {
    var allTargets:
    {
      [id: number]: Templates.AbilityTemplate[];
    } = {};

    for (var i = 0; i < user.abilities.length; i++)
    {
      var ability = user.abilities[i];

      var targets = getPotentialTargets(battle, user, ability);

      for (var j = 0; j < targets.length; j++)
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
}
