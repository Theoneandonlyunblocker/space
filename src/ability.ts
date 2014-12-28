/// <reference path="../data/templates/effecttemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="battle.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="targeting.ts"/>

module Rance
{
  export function useAbility(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate, target: Unit)
  {
    var isValidTarget = validateTarget(battle, user, ability, target);
    if (!isValidTarget)
    {
      console.warn("Invalid target");
    }

    target = getTargetOrGuard(battle, user, ability, target);

    var previousUserGuard = user.battleStats.guardAmount;

    var effectsToCall = [ability.mainEffect];
    if (ability.secondaryEffects)
    {
      effectsToCall = effectsToCall.concat(ability.secondaryEffects);
    }

    for (var i = 0; i < effectsToCall.length; i++)
    {
      var effect = effectsToCall[i];
      var targetsInArea = getUnitsInEffectArea(battle, user, effect, target.battleStats.position);

      for (var j = 0; j < targetsInArea.length; j++)
      {
        var target = targetsInArea[j];

        effect.effect.call(null, user, target);
      }
    }

    user.removeActionPoints(ability.actionsUse);
    user.addMoveDelay(ability.moveDelay);

    if (user.battleStats.guardAmount < previousUserGuard)
    {
      user.removeAllGuard();
    }
  }
  export function validateTarget(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate, target: Unit)
  {
    var potentialTargets = getPotentialTargets(battle, user, ability);

    return potentialTargets.indexOf(target) >= 0;
  }
  export function getTargetOrGuard(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate, target: Unit)
  {
    var guarding = getGuarders(battle, user, ability, target);

    guarding = guarding.sort(function(a: Unit, b: Unit)
    {
      return a.battleStats.guardAmount - b.battleStats.guardAmount;
    });

    for (var i = 0; i < guarding.length; i++)
    {
      var guardRoll = Math.random() * 100;
      if (guardRoll <= guarding[i].battleStats.guardAmount)
      {
        return guarding[i];
      }
    }

    return target;
  }
  export function getGuarders(battle: Battle, user: Unit,
    ability:Templates.AbilityTemplate, target: Unit)
  {
    var allEnemies = getPotentialTargets(battle, user, Templates.Abilities.dummyTargetAll);

    var guarders = allEnemies.filter(function(unit: Unit)
    {
      if (unit.battleStats.guardCoverage === "all")
      {
        return unit.battleStats.guardAmount > 0;
      }
      else if (unit.battleStats.guardCoverage === "column")
      {
        // same column
        if (unit.battleStats.position[0] === target.battleStats.position[0])
        {
          return unit.battleStats.guardAmount > 0;
        }
      }
    });

    return guarders;
  }
  export function getPotentialTargets(battle: Battle, user: Unit,
    ability: Templates.AbilityTemplate): Unit[]
  {
    if (ability.mainEffect.targetRange === "self")
    {
      return [user];
    }
    var fleetsToTarget = getFleetsToTarget(battle, user, ability.mainEffect);

    if (ability.mainEffect.targetRange === "close")
    {
      var farColumnForSide =
      {
        side1: 0,
        side2: 3
      };

      if (user.battleStats.position[0] ===
        farColumnForSide[user.battleStats.side])
      {
        return [];
      }

      var oppositeSide = reverseSide(user.battleStats.side);

      fleetsToTarget[farColumnForSide[oppositeSide]] = [null];
    }

    var fleetFilterFN = function(target: Unit)
    {
      if (!Boolean(target))
      {
        return false;
      }
      else if (!target.isTargetable())
      {
        return false;
      }

      return true;
    }

    var targets = flatten2dArray(fleetsToTarget).filter(fleetFilterFN);

    return targets;
  }
  export function getFleetsToTarget(battle: Battle, user: Unit,
    effect: Templates.IEffectTemplate): Unit[][]
  {
    var nullFleet =
    [
      [null, null, null, null],
      [null, null, null, null]
    ];
    var insertNullBefore;
    var toConcat;

    switch (effect.targetFleets)
    {
      case "all":
      {
        return battle.side1.concat(battle.side2);
      }
      case "ally":
      {
        insertNullBefore = user.battleStats.side === "side1" ? false : true;
        toConcat = battle[user.battleStats.side];
        break;
      }
      case "enemy":
      {
        insertNullBefore = user.battleStats.side === "side1" ? true : false;
        toConcat = battle[reverseSide(user.battleStats.side)];
        break;
      }
    }

    if (insertNullBefore)
    {
      return nullFleet.concat(toConcat);
    }
    else
    {
      return toConcat.concat(nullFleet);
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
    return getUnitsInEffectArea(battle, user, ability.mainEffect, target);
  }
  export function getUnitsInEffectArea(battle: Battle, user: Unit,
    effect: Templates.IEffectTemplate, target: number[]): Unit[]
  {
    var targetFleets = getFleetsToTarget(battle, user, effect);

    var inArea = effect.targetingFunction(targetFleets, target);

    return inArea.filter(Boolean);
  }

  export function getTargetsForAllAbilities(battle: Battle, user: Unit)
  {
    if (!user || !battle.activeUnit)
    {
      return null;
    }

    var allTargets:
    {
      [id: number]: Templates.AbilityTemplate[];
    } = {};

    var abilities = user.getAllAbilities();
    for (var i = 0; i < abilities.length; i++)
    {
      var ability = abilities[i];

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
