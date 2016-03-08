/// <reference path="templateinterfaces/iabilitytemplate.d.ts" />
/// <reference path="templateinterfaces/iabilitytemplateeffect.d.ts" />
/// <reference path="templateinterfaces/ibattlesfxtemplate.d.ts" />
/// <reference path="battle.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="targeting.ts"/>

module Rance
{
  export interface IAbilityUseDataEffect
  {
    effects: {(): void;}[];
    user: Unit;
    target: Unit;
    sfx: Templates.IBattleSFXTemplate;
    trigger: (user: Unit, target: Unit) => boolean;
  }
  export interface IAbilityUseData
  {
    user: Unit;
    originalTarget: Unit;
    actualTarget: Unit;
    beforeUse: {(): void;}[];
    effectsToCall: IAbilityUseDataEffect[];
    afterUse: {(): void;}[];
  }
  export function getAbilityUseData(battle: Battle, user: Unit,
    ability: Templates.IAbilityTemplate, target: Unit): IAbilityUseData
  {
    if (ability.preparation)
    {
      if (!user.battleStats.queuedAction)
      {
        user.setQueuedAction(ability, target);
        return getPreparationDummyData(user);
      }
      else
      {
        user.updateQueuedAction();
        if (!user.isReadyToUseQueuedAction())
        {
          return getPreparationDummyData(user);
        }
        else
        {
          var action = user.battleStats.queuedAction;
          var target = battle.unitsById[action.targetId];
          var ability = action.ability;
          user.clearQueuedAction();
        }
      }
    }

    var data: IAbilityUseData =
    {
      user: user,
      originalTarget: target,
      actualTarget: getTargetOrGuard(battle, user, ability, target),
      effectsToCall: [],
      beforeUse: [],
      afterUse: []
    }

    var passiveSkills = user.getPassiveSkillsByPhase();


    var beforeUseEffects: Templates.IAbilityTemplateEffect[] = [];

    if (ability.beforeUse)
    {
      beforeUseEffects = beforeUseEffects.concat(ability.beforeUse);
    }

    if (passiveSkills.beforeAbilityUse)
    {
      for (var i = 0; i < passiveSkills.beforeAbilityUse.length; i++)
      {
        beforeUseEffects = beforeUseEffects.concat(passiveSkills.beforeAbilityUse[i].beforeAbilityUse);
      }
    }
    
    for (var i = 0; i < beforeUseEffects.length; i++)
    {
      var hasSfx = Boolean(beforeUseEffects[i].sfx);
      if (hasSfx)
      {
        data.effectsToCall.push(
        {
          effects: [beforeUseEffects[i].template.effect.bind(null, user, data.actualTarget, battle,
            beforeUseEffects[i].data)],
          user: user,
          target: data.actualTarget,
          sfx: beforeUseEffects[i].sfx,
          trigger: beforeUseEffects[i].trigger
        });
      }
      else
      {
        data.beforeUse.push(beforeUseEffects[i].template.effect.bind(null, user, data.actualTarget, battle,
          beforeUseEffects[i].data));
      }
    }

    data.beforeUse.push(user.removeActionPoints.bind(user, ability.actionsUse));
    
    if (!ability.addsGuard)
    {
      data.beforeUse.push(user.removeAllGuard.bind(user));
    }

    
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

        var boundEffects = [effect.template.effect.bind(null, user, effectTarget, battle, effect.data)];
        var attachedEffectsToAddAfter: IAbilityUseDataEffect[] = [];


        if (effect.attachedEffects)
        {
          for (var k = 0; k < effect.attachedEffects.length; k++)
          {
            var attachedEffect = effect.attachedEffects[k];
            var boundAttachedEffect =
              attachedEffect.template.effect.bind(null, user, effectTarget, battle, attachedEffect.data);

            if (attachedEffect.sfx)
            {
              attachedEffectsToAddAfter.push(
              {
                effects: [boundAttachedEffect],
                user: user,
                target: effectTarget,
                sfx: attachedEffect.sfx,
                trigger: attachedEffect.trigger
              });
            }
            else
            {
              boundEffects.push(boundAttachedEffect);
            }
          }
        }

        data.effectsToCall.push(
        {
          effects: boundEffects,
          user: user,
          target: effectTarget,
          sfx: effect.sfx,
          trigger: effect.trigger
        });

        if (attachedEffectsToAddAfter.length > 0)
        {
          data.effectsToCall = data.effectsToCall.concat(attachedEffectsToAddAfter);
        }
        
      }
    }

    var afterUseEffects: Templates.IAbilityTemplateEffect[] = [];

    if (ability.afterUse)
    {
      afterUseEffects = afterUseEffects.concat(ability.afterUse);
    }

    if (passiveSkills.afterAbilityUse)
    {
      for (var i = 0; i < passiveSkills.afterAbilityUse.length; i++)
      {
        afterUseEffects = afterUseEffects.concat(passiveSkills.afterAbilityUse[i].afterAbilityUse);
      }
    }

    for (var i = 0; i < afterUseEffects.length; i++)
    {
      var hasSfx = Boolean(afterUseEffects[i].sfx);
      if (hasSfx)
      {
        data.effectsToCall.push(
        {
          effects: [afterUseEffects[i].template.effect.bind(null, user, data.actualTarget, battle,
            afterUseEffects[i].data)],
          user: user,
          target: data.actualTarget,
          sfx: afterUseEffects[i].sfx,
          trigger: afterUseEffects[i].trigger
        });
      }
      else
      {
        data.afterUse.push(afterUseEffects[i].template.effect.bind(null, user, data.actualTarget, battle,
          afterUseEffects[i].data));
      }
    }

    data.afterUse.push(user.addMoveDelay.bind(user, ability.moveDelay));
    data.afterUse.push(user.updateStatusEffects.bind(user));

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
      var effectData = abilityData.effectsToCall[i];
      if (!effectData.trigger || effectData.trigger(effectData.user, effectData.target))
      {
        for (var j = 0; j < effectData.effects.length; j++)
        {
          effectData.effects[j]();
        }
      }
    }

    for (var i = 0; i < abilityData.afterUse.length; i++)
    {
      abilityData.afterUse[i]();
    }
  }
  export function getPreparationDummyData(user: Unit)
  {
    var action = user.battleStats.queuedAction;

    var dummyData: IAbilityUseData =
    {
      user: user,
      originalTarget: user,
      actualTarget: user,
      effectsToCall: [],
      beforeUse: [],
      afterUse: []
    }

    dummyData.beforeUse.push(user.removeAllGuard.bind(user));

    dummyData.effectsToCall.push(
    {
      effects: [],
      user: user,
      target: user,
      sfx:
      {
        duration: 100
      },
      trigger: null
    });

    dummyData.afterUse.push(user.addMoveDelay.bind(user, action.ability.preparation.prepDelay));

    return dummyData;
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
    if (ability.bypassesGuard)
    {
      return target;
    }
    
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
    var enemySide = reverseSide(user.battleStats.side);
    if (target.battleStats.side !== enemySide) return [];

    var allEnemies = battle.unitsBySide[enemySide];

    var guarders = allEnemies.filter(function(unit: Unit)
    {
      if (!unit.isTargetable) return false;
      
      if (unit.battleStats.guardCoverage === GuardCoverage.all)
      {
        return unit.battleStats.guardAmount > 0;
      }
      else if (unit.battleStats.guardCoverage === GuardCoverage.row)
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
    var fleetsToTarget = getFleetsToTarget(battle, user, ability.mainEffect.template);

    var targetsInRange = ability.mainEffect.template.targetRangeFunction(fleetsToTarget, user);

    var untargetableFilterFN = function(target: Unit)
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

    var targets = targetsInRange.filter(untargetableFilterFN);

    return targets;
  }
  export function getFleetsToTarget(battle: Battle, user: Unit,
    effect: Templates.IEffectTemplate): Unit[][]
  {
    var nullFleet: Unit[][] = [];
    var rows = app.moduleData.ruleSet.battle.rowsPerFormation;
    var columns = app.moduleData.ruleSet.battle.cellsPerRow;
    for (var i = 0; i < rows; i++)
    {
      nullFleet.push([]);
      for (var j = 0; j < columns; j++)
      {
        nullFleet[i].push(null);
      }
    }
    var insertNullBefore: boolean;
    var toConcat: Unit[][];

    switch (effect.targetFleets)
    {
      case TargetFleet.either:
      {
        return battle.side1.concat(battle.side2);
      }
      case TargetFleet.ally:
      {
        insertNullBefore = user.battleStats.side === "side1" ? false : true;
        toConcat = battle[user.battleStats.side];
        break;
      }
      case TargetFleet.enemy:
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
    var targetPositions: number[][] = [];

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

    var inArea = effect.battleAreaFunction(targetFleets, target);

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
