/// <reference path="battleabilityprocessor.ts" />

module Rance
{
  export interface IUnitDisplayData
  {
    health: number;
    guardAmount: number;
    guardType: GuardCoverage;
    actionPoints: number;

    isPreparing: boolean;
    isAnnihilated: boolean;
  }
  export interface IUnitDisplayDataById
  {
    [unitId: number]: IUnitDisplayData;
  }
  export interface IAbilityUseEffect
  {
    actionName: string;
    unitDisplayDataAfterUsingById: IUnitDisplayDataById;
    sfx: Templates.IBattleSFXTemplate;
    sfxUser: Unit;
    sfxTarget: Unit;
  }

  /**
   * takes IAbilityEffectDataByPhase, executes effect actions and produces IAbilityUseEffect[]
   */
  export class BattleAbilityUser
  {
    private battle: Battle;
    private battleAbilityProcessor: BattleAbilityProcessor;

    constructor(battle: Battle)
    {
      this.battle = battle;
      this.battleAbilityProcessor = new BattleAbilityProcessor(battle);
    }
    public destroy()
    {
      this.battle = null;
      this.battleAbilityProcessor.destroy();
      this.battleAbilityProcessor = null;
    }

    public useAbility(ability: Templates.IAbilityTemplate, user: Unit, target: Unit, getEffects: boolean)
    {
      var effectDataByPhase = this.battleAbilityProcessor.getAbilityEffectDataByPhase(
      {
        ability: ability,
        user: user,
        intendedTarget: target
      });

      var useData = this.executeFullAbilityEffects(effectDataByPhase, getEffects);

      return useData;
    }
    public executeFullAbilityEffects(abilityEffectData: IAbilityEffectDataByPhase,
      getUseEffects: boolean): IAbilityUseEffect[]
    {
      var beforeUse = this.executeMultipleEffects(abilityEffectData.beforeUse, getUseEffects);
      var abilityEffects = this.executeMultipleEffects(abilityEffectData.abilityEffects, getUseEffects);
      var afterUse = this.executeMultipleEffects(abilityEffectData.afterUse, getUseEffects);

      if (getUseEffects)
      {
        return beforeUse.concat(abilityEffects, afterUse);
      }
      else
      {
        return null;
      }
    }
    public getTargetsForAllAbilities(user: Unit)
    {
      return this.battleAbilityProcessor.getTargetsForAllAbilities(user);
    }

    private executeMultipleEffects(abilityEffectData: IAbilityEffectData[],
      getUseEffects: boolean): IAbilityUseEffect[]
    {
      if (getUseEffects)
      {
        var useEffects: IAbilityUseEffect[] = [];

        for (var i = 0; i < abilityEffectData.length; i++)
        {
          var useEffect = this.executeAbilityEffectDataAndGetUseEffect(abilityEffectData[i]);
          if (useEffect)
          {
            useEffects.push(useEffect);
          }
        }

        return useEffects;
      }
      else
      {
        for (var i = 0; i < abilityEffectData.length; i++)
        {
          this.executeAbilityEffectData(abilityEffectData[i]);
        }
      }
    }

    private getUnitDisplayData(unit: Unit): IUnitDisplayData
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

    private shouldEffectActionTrigger(abilityEffectData: IAbilityEffectData)
    {
      if (!abilityEffectData.trigger)
      {
        return true;
      }

      return abilityEffectData.trigger(abilityEffectData.user, abilityEffectData.target);
    }
    private executeAbilityEffectData(abilityEffectData: IAbilityEffectData): boolean
    {
      if (!this.shouldEffectActionTrigger(abilityEffectData))
      {
        return false;
      }

      abilityEffectData.templateEffect.action.executeAction(
        abilityEffectData.user,
        abilityEffectData.target,
        this.battle,
        abilityEffectData.templateEffect.data
      );

      return true;
    }
    private executeAbilityEffectDataAndGetUseEffect(abilityEffectData: IAbilityEffectData): IAbilityUseEffect
    {
      var didTriggerAction = this.executeAbilityEffectData(abilityEffectData);
      if (!didTriggerAction)
      {
        return null;
      }

      var unitDisplayData: IUnitDisplayDataById = {}
      unitDisplayData[abilityEffectData.user.id] = this.getUnitDisplayData(abilityEffectData.user);
      unitDisplayData[abilityEffectData.target.id] = this.getUnitDisplayData(abilityEffectData.target);

      return(
      {
        actionName: abilityEffectData.templateEffect.action.name,
        unitDisplayDataAfterUsingById: unitDisplayData,
        sfx: abilityEffectData.templateEffect.sfx,
        sfxUser: abilityEffectData.user,
        sfxTarget: abilityEffectData.target
      })
    }
  }
}
