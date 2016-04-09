import AbilityTemplate from "./templateinterfaces/AbilityTemplate.d.ts";
import AbilityEffectTemplate from "./templateinterfaces/AbilityEffectTemplate.d.ts";
import EffectActionTemplate from "./templateinterfaces/EffectActionTemplate.d.ts";

import Unit from "./Unit.ts";
import GuardCoverage from "./GuardCoverage.ts";
import Battle from "./Battle.ts";

import
{
  getFormationsToTarget
} from "./battleAbilityTargeting.ts";

export interface AbilityUseData
{
  ability: AbilityTemplate;
  user: Unit;
  intendedTarget: Unit;
  actualTarget?: Unit;
}
export interface AbilityEffectData
{
  templateEffect: AbilityEffectTemplate;
  user: Unit;
  target: Unit;
  trigger: (user: Unit, target: Unit) => boolean;
}
export interface AbilityEffectDataByPhase
{
  beforeUse: AbilityEffectData[];
  abilityEffects: AbilityEffectData[];
  afterUse: AbilityEffectData[];
}
export function getAbilityEffectDataByPhase(battle: Battle, abilityUseData: AbilityUseData): AbilityEffectDataByPhase
{
  abilityUseData.actualTarget = getTargetOrGuard(battle, abilityUseData);

  var beforeUse = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getBeforeAbilityUseEffectTemplates(abilityUseData)
  );

  var abilityEffects = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getAbilityUseEffectTemplates(abilityUseData)
  );

  var afterUse = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getAfterAbilityUseEffectTemplates(abilityUseData)
  );

  return(
  {
    beforeUse: beforeUse,
    abilityEffects: abilityEffects,
    afterUse: afterUse
  });
}

function getTargetOrGuard(battle: Battle, abilityUseData: AbilityUseData): Unit
{
  if (abilityUseData.ability.bypassesGuard)
  {
    return abilityUseData.intendedTarget;
  }
  
  var guarding = getGuarders(battle, abilityUseData);

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

  return abilityUseData.intendedTarget;
}
function canGuardFN(intendedTarget: Unit, unit: Unit)
{
  if (!unit.isTargetable())
  {
    return false;
  }
  
  if (unit.battleStats.guardCoverage === GuardCoverage.all)
  {
    return unit.battleStats.guardAmount > 0;
  }
  else if (unit.battleStats.guardCoverage === GuardCoverage.row)
  {
    // same row
    if (unit.battleStats.position[0] === intendedTarget.battleStats.position[0])
    {
      return unit.battleStats.guardAmount > 0;
    }
  }
}
function getGuarders(battle: Battle, abilityUseData: AbilityUseData): Unit[]
{
  var userSide = abilityUseData.user.battleStats.side;
  var targetSide = abilityUseData.intendedTarget.battleStats.side;

  if (userSide === targetSide) return [];

  var allEnemies = battle.unitsBySide[targetSide];

  var guarders = allEnemies.filter(canGuardFN.bind(null, abilityUseData.intendedTarget));

  return guarders;
}

function activeUnitsFilterFN(unit: Unit)
{
  return unit && unit.isActiveInBattle();
}
function getUnitsInEffectArea(battle: Battle,effect: EffectActionTemplate,
  user: Unit, target: Unit): Unit[]
{
  var targetFormations = getFormationsToTarget(battle, user, effect);

  var inArea = effect.battleAreaFunction(targetFormations, target.battleStats.position);

  return inArea.filter(activeUnitsFilterFN);
}

function getAbilityEffectDataFromEffectTemplates(battle: Battle, abilityUseData: AbilityUseData,
  effectTemplates: AbilityEffectTemplate[]): AbilityEffectData[]
{
  var effectData: AbilityEffectData[] = [];

  for (var i = 0; i < effectTemplates.length; i++)
  {
    var templateEffect = effectTemplates[i];
    var targetsForEffect = getUnitsInEffectArea(battle, templateEffect.action,
      abilityUseData.user, abilityUseData.actualTarget);

    for (var j = 0; j < targetsForEffect.length; j++)
    {
      effectData.push(
      {
        templateEffect: templateEffect,
        user: abilityUseData.user,
        target: targetsForEffect[j],
        trigger: templateEffect.trigger
      });
    }
  }

  return effectData;
}
function getEffectTemplatesWithAttachedEffects(templates: AbilityEffectTemplate[]):
  AbilityEffectTemplate[]
{
  var withAttached: AbilityEffectTemplate[] = [];

  for (var i = 0; i < templates.length; i++)
  {
    var template = templates[i];
    withAttached.push(template);
    if (template.attachedEffects)
    {
      for (var j = 0; j < template.attachedEffects.length; j++)
      {
        withAttached.push(template.attachedEffects[j]);
      }
    }
  }

  return withAttached;
}
function getBeforeAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplate[]
{
  var beforeUseEffects: AbilityEffectTemplate[] = [];
  if (abilityUseData.ability.beforeUse)
  {
    beforeUseEffects = beforeUseEffects.concat(abilityUseData.ability.beforeUse);
  }
  // TODO get these from status effects
  // var passiveSkills = abilityUseData.user.getPassiveSkillsByPhase().beforeAbilityUse;
  // if (passiveSkills)
  // {
  //   for (var i = 0; i < passiveSkills.length; i++)
  //   {
  //     beforeUseEffects = beforeUseEffects.concat(passiveSkills[i].beforeAbilityUse);
  //   }
  // }

  return getEffectTemplatesWithAttachedEffects(beforeUseEffects);
  // TODO remove guard & action points
}
function getAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplate[]
{
  var abilityUseEffects: AbilityEffectTemplate[] = [];
  abilityUseEffects.push(abilityUseData.ability.mainEffect);

  if (abilityUseData.ability.secondaryEffects)
  {
    abilityUseEffects = abilityUseEffects.concat(abilityUseData.ability.secondaryEffects);
  }

  return getEffectTemplatesWithAttachedEffects(abilityUseEffects);
}
function getAfterAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplate[]
{
  var afterUseEffects: AbilityEffectTemplate[] = [];
  if (abilityUseData.ability.afterUse)
  {
    afterUseEffects = afterUseEffects.concat(abilityUseData.ability.afterUse);
  }

  // TODO get these from status effects
  // var passiveSkills = abilityUseData.user.getPassiveSkillsByPhase().afterAbilityUse;
  // if (passiveSkills)
  // {
  //   for (var i = 0; i < passiveSkills.length; i++)
  //   {
  //     afterUseEffects = afterUseEffects.concat(passiveSkills[i].afterAbilityUse);
  //   }
  // }

  return getEffectTemplatesWithAttachedEffects(afterUseEffects);
  // TODO add move delay & update status effects
}
