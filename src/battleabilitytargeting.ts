/// <reference path="battle.ts" />
/// <reference path="unit.ts" />

module Rance
{
  var nullFormation: Unit[][];
  setNullFormation(); // TODO | set when module is loaded
  export function setNullFormation()
  {
    var formation: Unit[][] = [];

    var rows = app.moduleData.ruleSet.battle.rowsPerFormation;
    var columns = app.moduleData.ruleSet.battle.cellsPerRow;
    for (var i = 0; i < rows; i++)
    {
      formation.push([]);
      for (var j = 0; j < columns; j++)
      {
        formation[i].push(null);
      }
    }

    nullFormation = formation;
  }

  function getFormationsToTarget(battle: Battle, user: Unit, effect: Templates.IEffectActionTemplate): Unit[][]
  {
    if (effect.targetFormations === TargetFormation.either)
    {
      return battle.side1.concat(battle.side2);
    }
    else
    {
      var userSide = user.battleStats.side;
      var insertNullBefore = (userSide === "side1") ? true : false;
      var toConcat: Unit[][];
    }

    if (effect.targetFormations === TargetFormation.ally)
    {
      toConcat = battle[userSide];
    }
    else if (effect.targetFormations === TargetFormation.enemy)
    {
      toConcat = battle[reverseSide(userSide)];
    }
    else
    {
      throw new Error("Invalid target formation for effect: " + effect.name);
    }

    if (insertNullBefore)
    {
      return nullFormation.concat(toConcat);
    }
    else
    {
      return toConcat.concat(nullFormation);
    }
  }

  function isTargetableFilterFN(unit: Unit)
  {
    return unit && unit.isTargetable();
  }
  function getPotentialTargets(battle: Battle, user: Unit, ability: Templates.IAbilityTemplate): Unit[]
  {
    var targetFormations = this.getFormationsToTarget(user, ability.mainEffect.action);

    var targetsInRange = ability.mainEffect.action.targetRangeFunction(targetFormations, user);

    var targets = targetsInRange.filter(isTargetableFilterFN);

    return targets;
  }
  export function getTargetsForAllAbilities(battle: Battle, user: Unit)
  {
    // TODO | does this ever matter?
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

      var targets = getPotentialTargets(user, ability);

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
