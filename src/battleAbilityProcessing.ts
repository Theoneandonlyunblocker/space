import
{
  AbilityEffectTemplate,
  AbilityEffectTrigger,
} from "./templateinterfaces/AbilityEffectTemplate";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";

import Battle from "./Battle";
import GuardCoverage from "./GuardCoverage";
import StatusEffect from "./StatusEffect";
import Unit from "./Unit";
import
{
  areaSingle,
} from "./targeting";

interface AbilityEffectTemplateWithSource
{
  template: AbilityEffectTemplate;
  sourceStatusEffect: StatusEffect | null;
}

export interface AbilityUseData
{
  ability: AbilityTemplate;
  user: Unit;
  intendedTarget: Unit;
  actualTarget?: Unit;
}
export interface AbilityEffectData
{
  sourceAbility: AbilityTemplate | null;
  sourceStatusEffect: StatusEffect | null;
  effectTemplate: AbilityEffectTemplate;
  user: Unit;
  target: Unit;
  trigger: AbilityEffectTrigger;
}
export interface AbilityEffectDataByPhase
{
  beforeUse: AbilityEffectData[];
  abilityEffects: AbilityEffectData[];
  afterUse: AbilityEffectData[];
}
export function getAbilityEffectDataByPhase(
  battle: Battle,
  abilityUseData: AbilityUseData,
): AbilityEffectDataByPhase
{
  abilityUseData.actualTarget = getTargetOrGuard(battle, abilityUseData);

  const beforeUse = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getBeforeAbilityUseEffectTemplates(abilityUseData),
    abilityUseData.actualTarget,
  );
  beforeUse.push(...getDefaultBeforeUseEffects(abilityUseData));

  const abilityEffects = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getAbilityUseEffectTemplates(abilityUseData),
    abilityUseData.actualTarget,
  );

  const afterUse = getAbilityEffectDataFromEffectTemplates(
    battle,
    abilityUseData,
    getAfterAbilityUseEffectTemplates(abilityUseData),
    abilityUseData.actualTarget,
  );
  afterUse.push(...getDefaultAfterUseEffects(abilityUseData));

  return(
  {
    beforeUse: beforeUse,
    abilityEffects: abilityEffects,
    afterUse: afterUse,
  });
}

function getTargetOrGuard(battle: Battle, abilityUseData: AbilityUseData): Unit
{
  if (abilityUseData.ability.targetCannotBeDiverted)
  {
    return abilityUseData.intendedTarget;
  }

  let guarding = getGuarders(battle, abilityUseData);

  guarding = guarding.sort((a, b) =>
  {
    return a.battleStats.guardAmount - b.battleStats.guardAmount;
  });

  for (let i = 0; i < guarding.length; i++)
  {
    const guardRoll = Math.random() * 100;
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
    if (unit.battleStats.guardCoverage === GuardCoverage.All)
    {
      return true;
    }
    else if (unit.battleStats.guardCoverage === GuardCoverage.Row)
    {
      // same row
      if (unit.battleStats.position[0] === intendedTarget.battleStats.position[0])
      {
        return true;
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

function getAbilityEffectDataFromEffectTemplate(
  battle: Battle,
  abilityUseData: AbilityUseData,
  effectTemplate: AbilityEffectTemplate,
  target: Unit,
  sourceStatusEffect: StatusEffect | null,
): AbilityEffectData[]
{
  const effectData: AbilityEffectData[] = [];

  const unitsInEffectArea = effectTemplate.getUnitsInArea(abilityUseData.user, target, battle);

  unitsInEffectArea.forEach(unitInEffectArea =>
  {
    effectData.push(
    {
      sourceAbility: abilityUseData.ability,
      effectTemplate: effectTemplate,
      user: abilityUseData.user,
      target: unitInEffectArea,
      trigger: effectTemplate.trigger,
      sourceStatusEffect: sourceStatusEffect,
    });

    const attachedEffects = effectTemplate.attachedEffects || [];

    attachedEffects.forEach(attachedEffectTemplate =>
    {
      effectData.push(...getAbilityEffectDataFromEffectTemplate(
        battle,
        abilityUseData,
        attachedEffectTemplate,
        unitInEffectArea,
        sourceStatusEffect,
      ));
    });
  });

  return effectData;
}
function getAbilityEffectDataFromEffectTemplates(
  battle: Battle,
  abilityUseData: AbilityUseData,
  effectTemplatesWithSource: AbilityEffectTemplateWithSource[],
  target: Unit,
): AbilityEffectData[]
{
  const effectData: AbilityEffectData[] = [];

  effectTemplatesWithSource.forEach(effectTemplateWithSource =>
  {
    effectData.push(...getAbilityEffectDataFromEffectTemplate(
      battle,
      abilityUseData,
      effectTemplateWithSource.template,
      target,
      effectTemplateWithSource.sourceStatusEffect,
    ));
  });

  return effectData;
}
function getBeforeAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplateWithSource[]
{
  const beforeUseEffects: AbilityEffectTemplateWithSource[] = [];
  if (abilityUseData.ability.beforeUse)
  {
    beforeUseEffects.push(...abilityUseData.ability.beforeUse.map(effectTemplate =>
    {
      return(
      {
        template: effectTemplate,
        sourceStatusEffect: null,
      });
    }));
  }

  abilityUseData.user.battleStats.statusEffects.forEach(statusEffect =>
  {
    if (statusEffect.template.beforeAbilityUse)
    {
      beforeUseEffects.push(...statusEffect.template.beforeAbilityUse.map(effectTemplate =>
      {
        return(
        {
          template: effectTemplate,
          sourceStatusEffect: statusEffect,
        });
      }));
    }
  });

  return beforeUseEffects;
}
function getAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplateWithSource[]
{
  let abilityUseEffects: AbilityEffectTemplate[] = [];
  abilityUseEffects.push(abilityUseData.ability.mainEffect);

  if (abilityUseData.ability.secondaryEffects)
  {
    abilityUseEffects = abilityUseEffects.concat(abilityUseData.ability.secondaryEffects);
  }

  return abilityUseEffects.map(effectTemplate =>
  {
    return(
    {
      template: effectTemplate,
      sourceStatusEffect: null,
    });
  });
}
function getAfterAbilityUseEffectTemplates(abilityUseData: AbilityUseData): AbilityEffectTemplateWithSource[]
{
  const afterUseEffects: AbilityEffectTemplateWithSource[] = [];
  if (abilityUseData.ability.afterUse)
  {
    afterUseEffects.push(...abilityUseData.ability.afterUse.map(effectTemplate =>
    {
      return(
      {
        template: effectTemplate,
        sourceStatusEffect: null,
      });
    }));
  }

  abilityUseData.user.battleStats.statusEffects.forEach(statusEffect =>
  {
    if (statusEffect.template.afterAbilityUse)
    {
      afterUseEffects.push(...statusEffect.template.afterAbilityUse.map(effectTemplate =>
      {
        return(
        {
          template: effectTemplate,
          sourceStatusEffect: statusEffect,
        });
      }));
    }
  });


  return afterUseEffects;
}
function makeSelfAbilityEffectData(
  user: Unit, name: string, actionFN: (user: Unit) => void): AbilityEffectData
{
  return(
  {
    sourceAbility: null,
    sourceStatusEffect: null,
    effectTemplate:
    {
      id: name,
      getDisplayDataForTarget: () => {return {}},
      getUnitsInArea: areaSingle,
      executeAction: actionFN,
    },
    user: user,
    target: user,
    trigger: null,
  });
}
function getDefaultBeforeUseEffects(abilityUseData: AbilityUseData): AbilityEffectData[]
{
  const effects: AbilityEffectData[] = [];

  if (!abilityUseData.ability.doesNotRemoveUserGuard)
  {
    effects.push(makeSelfAbilityEffectData(
      abilityUseData.user,
      "removeGuard",
      user => user.removeAllGuard(),
    ));
  }

  effects.push(makeSelfAbilityEffectData(
    abilityUseData.user,
    "removeActionPoints",
    user => user.removeActionPoints(abilityUseData.ability.actionsUse),
  ));

  return effects;
}
function getDefaultAfterUseEffects(abilityUseData: AbilityUseData): AbilityEffectData[]
{
  const effects: AbilityEffectData[] = [];

  effects.push(makeSelfAbilityEffectData(
    abilityUseData.user,
    "addMoveDelay",
    user => user.addMoveDelay(abilityUseData.ability.moveDelay),
  ));

  effects.push(makeSelfAbilityEffectData(
    abilityUseData.user,
    "updateStatusEffects",
    user => user.updateStatusEffects(),
  ));

  return effects;
}
