
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import EffectActionTemplate from "./templateinterfaces/EffectActionTemplate";

import getNullFormation from "./getNullFormation";
import Unit from "./Unit";
import Battle from "./Battle";
import
{
  reverseSide
} from "./utility";
import
{
  TargetFormation
} from "./targeting";

export function getFormationsToTarget(battle: Battle, user: Unit, effect: EffectActionTemplate): Unit[][]
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
    return getNullFormation().concat(toConcat);
  }
  else
  {
    return toConcat.concat(getNullFormation());
  }
}
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
  var targetFormations = getFormationsToTarget(battle, user, ability.mainEffect.action);

  var targetsInRange = ability.mainEffect.action.targetRangeFunction(targetFormations, user);

  var targets = targetsInRange.filter(isTargetableFilterFN);

  return targets;
}
