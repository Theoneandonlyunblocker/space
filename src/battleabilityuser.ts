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
    unitDisplayDataById: IUnitDisplayDataById;
    sfx: Templates.IBattleSFXTemplate;
    sfxUser: Unit;
    sfxTarget: Unit;
  }

  /**
   * takes IAbilityEffectDataByPhase, executes effect actions and produces IAbilityUseEffect
   */
  export class BattleAbilityUser
  {
    private battle: Battle;
    private abilityEffectData: IAbilityEffectDataByPhase;

    private currentlyRecordingUnitChanges: IUnitDisplayDataById = {};

    constructor(battle: Battle, abilityEffectData: IAbilityEffectDataByPhase)
    {
      this.battle = battle;
      this.abilityEffectData = abilityEffectData;
    }
    public destroy()
    {
      this.battle = null;
      this.abilityEffectData = null;
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
        isAnnihilated: unit.displayFlags.isAnnihilated
      });
    }

    private shouldEffectActionTrigger(abilityEffectData: IAbilityEffectData)
    {
      return abilityEffectData.trigger(abilityEffectData.user, abilityEffectData.target);
    }
    private executeAbilityEffectData(abilityEffectData: IAbilityEffectData): IAbilityUseEffect
    {
      var unitChanges: IUnitDisplayDataById = {};
    }
  }
}
