import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";

import Unit from "./Unit";
import Battle from "./Battle";
import UnitDisplayData from "./UnitDisplayData";
import
{
  AbilityEffectData,
  AbilityEffectDataByPhase,
  getAbilityEffectDataByPhase
} from "./battleAbilityProcessing";

export interface AbilityUseEffect
{
  actionName: string;
  changedUnitDisplayDataByID: {[unitId: number]: UnitDisplayData};
  sfx: BattleSFXTemplate;
  sfxUser: Unit;
  sfxTarget: Unit;
  newEvaluation: number;
}

export function useAbility(battle: Battle, ability: AbilityTemplate, user: Unit, target: Unit): void
{
  const effectDataByPhase = getAbilityEffectDataByPhase(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: target
  });

  executeFullAbilityEffects(battle, effectDataByPhase);
}
export function useAbilityAndGetUseEffects(battle: Battle, ability: AbilityTemplate,
  user: Unit, target: Unit): AbilityUseEffect[]
{
  const effectDataByPhase = getAbilityEffectDataByPhase(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: target
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
function executeFullAbilityEffectsAndGetUseEffects(battle: Battle,
  abilityEffectDataByPhase: AbilityEffectDataByPhase): AbilityUseEffect[]
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

function shouldEffectActionTrigger(abilityEffectData: AbilityEffectData): boolean
{
  if (!abilityEffectData.trigger)
  {
    return true;
  }

  return abilityEffectData.trigger(abilityEffectData.user, abilityEffectData.target);
}
function executeAbilityEffectData(battle: Battle, abilityEffectData: AbilityEffectData): boolean
{
  if (!shouldEffectActionTrigger(abilityEffectData))
  {
    return false;
  }

  abilityEffectData.templateEffect.action.executeAction(
    abilityEffectData.user,
    abilityEffectData.target,
    battle,
    abilityEffectData.templateEffect.data
  );

  return true;
}
function executeAbilityEffectDataAndGetUseEffect(battle: Battle,
  abilityEffectData: AbilityEffectData): AbilityUseEffect
{
  var didTriggerAction = executeAbilityEffectData(battle, abilityEffectData);
  if (!didTriggerAction)
  {
    return null;
  }

  var unitDisplayData: {[unitId: number]: UnitDisplayData} = {}
  unitDisplayData[abilityEffectData.user.id] = abilityEffectData.user.getDisplayData("battle");
  unitDisplayData[abilityEffectData.target.id] = abilityEffectData.target.getDisplayData("battle");

  return(
  {
    actionName: abilityEffectData.templateEffect.action.name,
    changedUnitDisplayDataByID: unitDisplayData,
    sfx: abilityEffectData.templateEffect.sfx,
    sfxUser: abilityEffectData.user,
    sfxTarget: abilityEffectData.target,
    newEvaluation: battle.getEvaluation()
  });
}
