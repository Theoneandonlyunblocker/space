import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import AbilityEffectTemplate from "./templateinterfaces/AbilityEffectTemplate";

import Unit from "./Unit";
import GuardCoverage from "./GuardCoverage";
import Battle from "./Battle";
import
{
  areaSingle,
} from "./targeting";

export interface AbilityUseData
{
  ability: AbilityTemplate;
  user: Unit;
  intendedTarget: Unit;
  actualTarget?: Unit;
}
export interface AbilityEffectData
{
  effectTemplate: AbilityEffectTemplate;
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

  const beforeUse = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getBeforeAbilityUseEffectTemplates(abilityUseData)
  );
  beforeUse.push(...getDefaultBeforeUseEffects(abilityUseData));

  const abilityEffects = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getAbilityUseEffectTemplates(abilityUseData)
  );

  const afterUse = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getAfterAbilityUseEffectTemplates(abilityUseData)
  );
  afterUse.push(...getDefaultAfterUseEffects(abilityUseData));

  return(
  {
    beforeUse: beforeUse,
    abilityEffects: abilityEffects,
    afterUse: afterUse
  });
}
export function getUnitsInEffectArea(effect: AbilityEffectTemplate, battle: Battle,
  user: Unit, target: Unit): Unit[]
{
  const inArea = effect.getUnitsInArea(user, target, battle);

  return inArea.filter(activeUnitsFilterFN);
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

  for (let i = 0; i < guarding.length; i++)
  {
    var guardRoll = Math.random() * 100;
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
    if (unit.battleStats.guardCoverage === GuardCoverage.all)
    {
      return true
    }
    else if (unit.battleStats.guardCoverage === GuardCoverage.row)
    {
      // same row
      if (unit.battleStats.position[0] === intendedTarget.battleStats.position[0])
      {
        return true
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

function activeUnitsFilterFN(unit: Unit)
{
  return unit && unit.isActiveInBattle();
}
function recursivelyGetAttachedEffects(effectTemplate: AbilityEffectTemplate): AbilityEffectTemplate[]
{
  const attachedEffects: AbilityEffectTemplate[] = [];
  const frontier: AbilityEffectTemplate[] = [effectTemplate];
  
  while (frontier.length > 0)
  {
    const currentEffect = frontier.pop();
    attachedEffects.push(...currentEffect.attachedEffects);
    frontier.push(...currentEffect.attachedEffects);
  }
  
  return attachedEffects;
}
function getAbilityEffectDataFromEffectTemplates(battle: Battle, abilityUseData: AbilityUseData,
  effectTemplates: AbilityEffectTemplate[]): AbilityEffectData[]
{
  const effectData: AbilityEffectData[] = [];

  for (let i = 0; i < effectTemplates.length; i++)
  {
    const effectTemplate = effectTemplates[i];
    const targetsForEffect = getUnitsInEffectArea(effectTemplate, battle,
      abilityUseData.user, abilityUseData.actualTarget);
    const withAttached = [effectTemplate].concat(recursivelyGetAttachedEffects(effectTemplate));

    for (let j = 0; j < targetsForEffect.length; j++)
    {
      for (let k = 0; k < withAttached.length; k++)
      {
        effectData.push(
        {
          effectTemplate: withAttached[k],
          user: abilityUseData.user,
          target: targetsForEffect[j],
          trigger: effectTemplate.trigger
        });
      }
    }
  }

  return effectData;
}
function getBeforeAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplate[]
{
  const beforeUseEffects: AbilityEffectTemplate[] = [];
  if (abilityUseData.ability.beforeUse)
  {
    beforeUseEffects.push(...abilityUseData.ability.beforeUse);
  }
  // TODO get these from status effects
  // var passiveSkills = abilityUseData.user.getPassiveSkillsByPhase().beforeAbilityUse;
  // if (passiveSkills)
  // {
  //   for (let i = 0; i < passiveSkills.length; i++)
  //   {
  //     beforeUseEffects = beforeUseEffects.concat(passiveSkills[i].beforeAbilityUse);
  //   }
  // }

  return beforeUseEffects;
}
function getAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplate[]
{
  var abilityUseEffects: AbilityEffectTemplate[] = [];
  abilityUseEffects.push(abilityUseData.ability.mainEffect);

  if (abilityUseData.ability.secondaryEffects)
  {
    abilityUseEffects = abilityUseEffects.concat(abilityUseData.ability.secondaryEffects);
  }

  return abilityUseEffects;
}
function getAfterAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplate[]
{
  const afterUseEffects: AbilityEffectTemplate[] = [];
  if (abilityUseData.ability.afterUse)
  {
    afterUseEffects.push(...abilityUseData.ability.afterUse);
  }

  // TODO get these from status effects
  // var passiveSkills = abilityUseData.user.getPassiveSkillsByPhase().afterAbilityUse;
  // if (passiveSkills)
  // {
  //   for (let i = 0; i < passiveSkills.length; i++)
  //   {
  //     afterUseEffects = afterUseEffects.concat(passiveSkills[i].afterAbilityUse);
  //   }
  // }
  
  return afterUseEffects;
}
function makeSelfAbilityEffectData(
  user: Unit, name: string, actionFN: (user: Unit) => void): AbilityEffectData
{
  return(
  {
    effectTemplate:
    {
      name: name,
      getUnitsInArea: areaSingle,
      executeAction: actionFN,
    },
    user: user,
    target: user,
    trigger: null
  });
}
function getDefaultBeforeUseEffects(abilityUseData: AbilityUseData): AbilityEffectData[]
{
  const effects: AbilityEffectData[] = [];
  
  if (!abilityUseData.ability.preservesUserGuard)
  {
    effects.push(makeSelfAbilityEffectData(
      abilityUseData.user,
      "removeGuard",
      user => user.removeAllGuard()
    ));
  }
  
  effects.push(makeSelfAbilityEffectData(
    abilityUseData.user,
    "removeActionPoints",
    user => user.removeActionPoints(abilityUseData.ability.actionsUse)
  ));
  
  return effects;
}
function getDefaultAfterUseEffects(abilityUseData: AbilityUseData): AbilityEffectData[]
{
  const effects: AbilityEffectData[] = [];
  
  effects.push(makeSelfAbilityEffectData(
    abilityUseData.user,
    "addMoveDelay",
    user => user.addMoveDelay(abilityUseData.ability.moveDelay)
  ));
  
  effects.push(makeSelfAbilityEffectData(
    abilityUseData.user,
    "updateStatusEffects",
    user => user.updateStatusEffects()
  ));
  
  return effects;
}
