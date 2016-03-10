/// <reference path="../unit.ts" />
/// <reference path="../statuseffect.ts" />

declare module Rance
{
  interface IUnitItemsSaveData
  {
    [slot: string]: IItemSaveData[];
  }
  interface IUnitBattleStatsSaveData
  {
    moveDelay: number;
    side: UnitBattleSide;
    position: number[];
    currentActionPoints: number;
    guardAmount: number;
    guardCoverage: GuardCoverage;
    captureChance: number;
    statusEffects: StatusEffect[];
    queuedAction: IQueuedActionData;
  }
  interface IUnitSaveData
  {
    templateType: string;
    id: number;
    name: string;
    maxHealth: number;
    currentHealth: number;
    currentMovePoints: number;
    maxMovePoints: number;
    timesActedThisTurn: number;
    baseAttributes: IUnitAttributes;
    abilityTemplateTypes: string[];
    passiveSkillTemplateTypes: string[];
    experienceForCurrentLevel: number;
    level: number;
    items: IUnitItemsSaveData;
    battleStats: IUnitBattleStatsSaveData;

    fleetId?: number;
    portraitKey?: string;
  }
}
