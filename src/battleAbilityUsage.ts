import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";

import Unit from "./Unit";
import Battle from "./Battle";
import GuardCoverage from "./GuardCoverage";
import
{
  AbilityEffectData,
  AbilityEffectDataByPhase,
  getAbilityEffectDataByPhase
} from "./battleAbilityProcessing";

export interface UnitDisplayData
{
  health: number;
  guardAmount: number;
  guardType: GuardCoverage;
  actionPoints: number;

  isPreparing: boolean;
  isAnnihilated: boolean;
}
export interface UnitDisplayDataById
{
  [unitId: number]: UnitDisplayData;
}
export interface AbilityUseEffect
{
  actionName: string;
  unitDisplayDataAfterUsingById: UnitDisplayDataById;
  sfx: BattleSFXTemplate;
  sfxUser: Unit;
  sfxTarget: Unit;
}

export function useAbility(battle: Battle, ability: AbilityTemplate,
  user: Unit, target: Unit, getEffects: boolean)
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

function getUnitDisplayData(unit: Unit): UnitDisplayData
{
  return(
  {
    health: unit.currentHealth,
    guardAmount: unit.battleStats.guardAmount,
    guardType: unit.battleStats.guardCoverage,
    actionPoints: unit.battleStats.currentActionPoints,

    isPreparing: Boolean(unit.battleStats.queuedAction),
    isAnnihilated: unit.battleStats.isAnnihilated
  });
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

  var unitDisplayData: UnitDisplayDataById = {}
  unitDisplayData[abilityEffectData.user.id] = getUnitDisplayData(abilityEffectData.user);
  unitDisplayData[abilityEffectData.target.id] = getUnitDisplayData(abilityEffectData.target);

  return(
  {
    actionName: abilityEffectData.templateEffect.action.name,
    unitDisplayDataAfterUsingById: unitDisplayData,
    sfx: abilityEffectData.templateEffect.sfx,
    sfxUser: abilityEffectData.user,
    sfxTarget: abilityEffectData.target
  })
}
