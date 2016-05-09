import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";

import Unit from "./Unit";
import Battle from "./Battle";
import GuardCoverage from "./GuardCoverage";
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

export function useAbility(battle: Battle, ability: AbilityTemplate,
  user: Unit, target: Unit, getEffects: boolean): AbilityUseEffect[]
{
  var effectDataByPhase = getAbilityEffectDataByPhase(battle,
  {
    ability: ability,
    user: user,
    intendedTarget: target
  });

  var useData = executeFullAbilityEffects(battle, effectDataByPhase, getEffects);

  return useData;
}
function executeFullAbilityEffects(battle: Battle, abilityEffectData: AbilityEffectDataByPhase,
  getUseEffects: boolean): AbilityUseEffect[]
{
  var beforeUse = executeMultipleEffects(battle, abilityEffectData.beforeUse, getUseEffects);
  var abilityEffects = executeMultipleEffects(battle, abilityEffectData.abilityEffects, getUseEffects);
  var afterUse = executeMultipleEffects(battle, abilityEffectData.afterUse, getUseEffects);

  if (getUseEffects)
  {
    return beforeUse.concat(abilityEffects, afterUse);
  }
  else
  {
    return null;
  }
}

function executeMultipleEffects(battle: Battle, abilityEffectData: AbilityEffectData[],
  getUseEffects: boolean): AbilityUseEffect[]
{
  if (getUseEffects)
  {
    var useEffects: AbilityUseEffect[] = [];

    for (let i = 0; i < abilityEffectData.length; i++)
    {
      var useEffect = executeAbilityEffectDataAndGetUseEffect(battle, abilityEffectData[i]);
      if (useEffect)
      {
        useEffects.push(useEffect);
      }
    }

    return useEffects;
  }
  else
  {
    for (let i = 0; i < abilityEffectData.length; i++)
    {
      executeAbilityEffectData(battle, abilityEffectData[i]);
    }
  }
}

function shouldEffectActionTrigger(abilityEffectData: AbilityEffectData)
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
