/// <reference path="../data/templates/effecttemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="battle.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="targeting.ts"/>

module Rance
{
  export interface IAbilityUseData
  {
    user: Unit;
    originalTarget: Unit;
    actualTarget: Unit;
    beforeUse: {(): void;}[];
    effectsToCall:
    {
      effects: {(): void;}[]; // primary effect and attached effects
      user: Unit;
      target: Unit;
    }[];
    afterUse: {(): void;}[];
  }
  export function getAbilityUseData(battle: Battle, user: Unit,
    ability: Templates.IAbilityTemplate, target: Unit): IAbilityUseData
  {
    var data = <IAbilityUseData> {};
    data.user = user;
    data.originalTarget = target;
    data.actualTarget = getTargetOrGuard(battle, user, ability, target);
    data.beforeUse = [];

    if (ability.beforeUse)
    {
      for (var i = 0; i < ability.beforeUse.length; i++)
      {
        data.beforeUse.push(ability.beforeUse[i].template.effect.bind(null, user, data.actualTarget,
          ability.beforeUse[i].data));
      }
    }

    if (!ability.addsGuard)
    {
      data.beforeUse.push(user.removeAllGuard.bind(user));
    }

    data.effectsToCall = [];
    
    var effectsToCall = [ability.mainEffect];
    if (ability.secondaryEffects)
    {
      effectsToCall = effectsToCall.concat(ability.secondaryEffects);
    }


    for (var i = 0; i < effectsToCall.length; i++)
    {
      var effect = effectsToCall[i];
      var targetsInArea = getUnitsInEffectArea(battle, user, effect.template,
        data.actualTarget.battleStats.position);

      for (var j = 0; j < targetsInArea.length; j++)
      {
        var effectTarget = targetsInArea[j];

        var boundEffects = [effect.template.effect.bind(null, user, effectTarget, effect.data)];

        if (effect.attachedEffects)
        {
          for (var k = 0; k < effect.attachedEffects.length; k++)
          {
            var attachedEffect = effect.attachedEffects[k];

            boundEffects.push(
              attachedEffect.template.effect.bind(null, user, effectTarget, attachedEffect.data)
            );
          }
        }

        data.effectsToCall.push(
        {
          effects: boundEffects,
          user: user,
          target: effectTarget
        });
      }
    }

    data.afterUse = [];

    if (ability.afterUse)
    {
      for (var i = 0; i < ability.afterUse.length; i++)
      {
        data.afterUse.push(ability.afterUse[i].template.effect.bind(null, user, data.actualTarget,
          ability.afterUse[i].data));
      }
    }

    data.afterUse.push(user.removeActionPoints.bind(user, ability.actionsUse));
    data.afterUse.push(user.addMoveDelay.bind(user, ability.moveDelay));

    return data;
  }
  // used for ai simulation. otherwise UIComponents.Battle steps through ability use data
  export function useAbility(battle: Battle, user: Unit,
    ability: Templates.IAbilityTemplate, target: Unit)
  {
    var abilityData = getAbilityUseData(battle, user, ability, target);

    for (var i = 0; i < abilityData.beforeUse.length; i++)
    {
      abilityData.beforeUse[i]();
    }

    for (var i = 0; i < abilityData.effectsToCall.length; i++)
    {
      for (var j = 0; j < abilityData.effectsToCall[i].effects.length; j++)
      {
        abilityData.effectsToCall[i].effects[j]();
      }
    }

    for (var i = 0; i < abilityData.afterUse.length; i++)
    {
      abilityData.afterUse[i]();
    }
  }
  export function validateTarget(battle: Battle, user: Unit,
    ability: Templates.IAbilityTemplate, target: Unit)
  {
    var potentialTargets = getPotentialTargets(battle, user, ability);

    return potentialTargets.indexOf(target) >= 0;
  }
  export function getTargetOrGuard(battle: Battle, user: Unit,
    ability: Templates.IAbilityTemplate, target: Unit)
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
    ability:Templates.IAbilityTemplate, target: Unit)
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
    ability: Templates.IAbilityTemplate): Unit[]
  {
    if (ability.mainEffect.template.targetRange === "self")
    {
      return [user];
    }
    var fleetsToTarget = getFleetsToTarget(battle, user, ability.mainEffect.template);

    if (ability.mainEffect.template.targetRange === "close")
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
    ability: Templates.IAbilityTemplate): number[][]
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
    ability: Templates.IAbilityTemplate, target: number[]): Unit[]
  {
    var inArea = getUnitsInEffectArea(battle, user, ability.mainEffect.template, target);

    if (ability.secondaryEffects)
    {
      for (var i = 0; i < ability.secondaryEffects.length; i++)
      {
        var inSecondary = getUnitsInEffectArea(
          battle, user, ability.secondaryEffects[i].template, target);
        for (var j = 0; j < inSecondary.length; j++)
        {
          if (inArea.indexOf(inSecondary[j]) === -1)
          {
            inArea.push(inSecondary[j]);
          }
        }
      }
    }

    return inArea;
  }
  export function getUnitsInEffectArea(battle: Battle, user: Unit,
    effect: Templates.IEffectTemplate, target: number[]): Unit[]
  {
    var targetFleets = getFleetsToTarget(battle, user, effect);

    var inArea = effect.targetingFunction(targetFleets, target);

    return inArea.filter(function(unit: Unit)
    {
      if (!unit) return false;
      else return unit.isActiveInBattle();
    });
  }

  export function getTargetsForAllAbilities(battle: Battle, user: Unit)
  {
    if (!user || !battle.activeUnit)
    {
      return null;
    }

    var allTargets:
    {
      [id: number]: Templates.IAbilityTemplate[];
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
