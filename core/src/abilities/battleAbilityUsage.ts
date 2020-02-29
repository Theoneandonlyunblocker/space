import {CombatAbilityTemplate} from "../templateinterfaces/CombatAbilityTemplate";

import {AbilityUseEffect} from "./AbilityUseEffect";
import {Battle} from "../battle/Battle";
import {Unit} from "../unit/Unit";
import {UnitDisplayData} from "../unit/UnitDisplayData";


type AbilityEffectData = any;
type AbilityEffectDataByPhase =
{
  beforeUse: AbilityEffectData[];
  abilityEffects: AbilityEffectData[];
  afterUse: AbilityEffectData[];
};
function getAbilityEffectDataByPhase(...args: any): any
{

}

export function useAbility(
  battle: Battle,
  ability: CombatAbilityTemplate,
  user: Unit,
  target: Unit,
): void
{
  const effectDataByPhase = getAbilityEffectDataByPhase(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: target,
  });

  executeFullAbilityEffects(battle, effectDataByPhase);
}
export function useAbilityAndGetUseEffects(
  battle: Battle,
  ability: CombatAbilityTemplate,
  user: Unit,
  target: Unit,
): AbilityUseEffect[]
{
  const effectDataByPhase = getAbilityEffectDataByPhase(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: target,
  });

  const useData = executeFullAbilityEffectsAndGetUseEffects(battle, effectDataByPhase);

  return useData;
}
function executeFullAbilityEffects(battle: Battle, abilityEffectDataByPhase: AbilityEffectDataByPhase): void
{
  [
    abilityEffectDataByPhase.beforeUse,
    abilityEffectDataByPhase.abilityEffects,
    abilityEffectDataByPhase.afterUse,
  ].forEach(effectDataForPhase =>
  {
    effectDataForPhase.forEach(effectData =>
    {
      executeAbilityEffectData(battle, effectData);
    });
  });
}
function executeFullAbilityEffectsAndGetUseEffects(
  battle: Battle,
  abilityEffectDataByPhase: AbilityEffectDataByPhase,
): AbilityUseEffect[]
{
  const useEffects: AbilityUseEffect[] = [];

  [
    abilityEffectDataByPhase.beforeUse,
    abilityEffectDataByPhase.abilityEffects,
    abilityEffectDataByPhase.afterUse,
  ].forEach(effectDataForPhase =>
  {
    effectDataForPhase.forEach(effectData =>
    {
      const useEffect = executeAbilityEffectDataAndGetUseEffect(battle, effectData);
      if (useEffect)
      {
        useEffects.push(useEffect);
      }
    });
  });

  return useEffects;
}

function shouldEffectActionTrigger(
  abilityEffectData: AbilityEffectData,
  battle: Battle,
): boolean
{
  if (!abilityEffectData.trigger)
  {
    return true;
  }

  return abilityEffectData.trigger(
    abilityEffectData.user,
    abilityEffectData.target,
    battle,
    abilityEffectData.sourceStatusEffect,
  );
}
function executeAbilityEffectData(
  battle: Battle,
  abilityEffectData: AbilityEffectData,
): boolean
{
  if (!shouldEffectActionTrigger(abilityEffectData, battle))
  {
    return false;
  }

  abilityEffectData.effectTemplate.executeAction(
    abilityEffectData.user,
    abilityEffectData.target,
    battle,
    abilityEffectData.sourceStatusEffect,
  );

  return true;
}
function executeAbilityEffectDataAndGetUseEffect(
  battle: Battle,
  abilityEffectData: AbilityEffectData,
): AbilityUseEffect
{
  const didTriggerAction = executeAbilityEffectData(battle, abilityEffectData);
  if (!didTriggerAction)
  {
    return null;
  }

  const changedUnitDisplayData: {[unitId: number]: UnitDisplayData} = {};
  changedUnitDisplayData[abilityEffectData.user.id] = abilityEffectData.user.getDisplayData("battle");
  changedUnitDisplayData[abilityEffectData.target.id] = abilityEffectData.target.getDisplayData("battle");

  return(
  {
    effectId: abilityEffectData.effectTemplate.id,
    changedUnitDisplayData: changedUnitDisplayData,
    vfx: abilityEffectData.effectTemplate.vfx,
    vfxUser: abilityEffectData.user,
    vfxTarget: abilityEffectData.target,
    newEvaluation: battle.getEvaluation(),
  });
}
