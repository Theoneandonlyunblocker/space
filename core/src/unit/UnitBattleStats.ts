import {GuardCoverage} from "./GuardCoverage";
import {QueuedActionData} from "../battle/QueuedActionData";
import {UnitBattleSide} from "./UnitBattleSide";
import { Unit } from "./Unit";
import { activeModuleData } from "../app/activeModuleData";
import { UnitBattleStatsSaveData } from "../savedata/UnitBattleStatsSaveData";
import { CombatEffectManager } from "../combat/CombatEffectManager";


export class UnitBattleStats
{
  /**
   * 0 to Infinity
   * 100 is the baseline for ability usage
   */
  public moveDelay: number;
  public side: UnitBattleSide | null;
  public position: number[] | null;
  public currentActionPoints: number;
  /**
   * 0 to Infinity
   * 1 = 1% chance to guard
   * 0-100 = 0-50% less physical damage taken
   */
  public guardAmount: number;
  public guardCoverage: GuardCoverage | null;
  /**
   * 0.0 to Infinity
   * 0.01 = 1% chance to capture
   * units with the highest capture chance are prioritized if # of captures are limited
   */
  public captureChance: number;
  public combatEffects: CombatEffectManager;
  public lastHealthBeforeReceivingDamage: number;
  public queuedAction: QueuedActionData | null;
  public isAnnihilated: boolean;

  constructor(props?:
  {
    moveDelay: number;
    side: UnitBattleSide | null;
    position: number[] | null;
    currentActionPoints: number;
    guardAmount: number;
    guardCoverage: GuardCoverage | null;
    captureChance: number;
    // TODO 2020.02.08 | how should this be done?
    combatEffects: CombatEffectManager;
    lastHealthBeforeReceivingDamage: number;
    queuedAction: QueuedActionData | null;
    isAnnihilated: boolean;
  })
  {
    if (props)
    {
      for (const key in props)
      {
        this[key] = props[key];
      }
    }
  }
  public static createInitialBattleStatsForUnit(unit: Unit): UnitBattleStats
  {
    // TODO 2020.01.31 | do this elsewhere & differently
    const baseMoveDelay = 30 - unit.attributes.speed;

    return new UnitBattleStats(
    {
      moveDelay: baseMoveDelay,
      currentActionPoints: unit.attributes.maxActionPoints,
      side: null,
      position: null,
      guardAmount: 0,
      guardCoverage: null,
      captureChance: activeModuleData.ruleSet.battle.baseUnitCaptureChance,
      combatEffects: new CombatEffectManager(),
      lastHealthBeforeReceivingDamage: unit.currentHealth,
      queuedAction: null,
      isAnnihilated: false,
    });
  }
  public static fromData(data: UnitBattleStatsSaveData): UnitBattleStats
  {
    return new UnitBattleStats(
    {
      moveDelay: data.moveDelay,
      side: data.side,
      position: data.position,
      currentActionPoints: data.currentActionPoints,
      guardAmount: data.guardAmount,
      guardCoverage: data.guardCoverage,
      captureChance: data.captureChance,
      isAnnihilated: data.isAnnihilated,

      lastHealthBeforeReceivingDamage: data.lastHealthBeforeReceivingDamage,

      combatEffects: CombatEffectManager.fromData(data.combatEffects, activeModuleData.templates.combatEffects),
      queuedAction:  data.queuedAction ?
        {
          ability: activeModuleData.templates.combatAbilities[data.queuedAction.abilityTemplateKey],
          targetId: data.queuedAction.targetId,
          turnsPrepared: data.queuedAction.turnsPrepared,
          timesInterrupted: data.queuedAction.timesInterrupted,
        } :
        null,
    });
  }

  public clone(): UnitBattleStats
  {
    return new UnitBattleStats(
    {
      moveDelay: this.moveDelay,
      side: this.side,
      position: this.position,
      currentActionPoints: this.currentActionPoints,
      guardAmount: this.guardAmount,
      guardCoverage: this.guardCoverage,
      captureChance: this.captureChance,
      combatEffects: this.combatEffects.clone(),
      lastHealthBeforeReceivingDamage: this.lastHealthBeforeReceivingDamage,
      queuedAction: this.queuedAction ?
        {
          ability: this.queuedAction.ability,
          targetId: this.queuedAction.targetId,
          turnsPrepared: this.queuedAction.turnsPrepared,
          timesInterrupted: this.queuedAction.timesInterrupted,
        } :
        null,
      isAnnihilated: this.isAnnihilated,
    });
  }
  public serialize(): UnitBattleStatsSaveData
  {
    return {
      moveDelay: this.moveDelay,
      side: this.side,
      position: this.position,
      currentActionPoints: this.currentActionPoints,
      guardAmount: this.guardAmount,
      guardCoverage: this.guardCoverage,
      captureChance: this.captureChance,
      combatEffects: this.combatEffects.serialize(),
      queuedAction: !this.queuedAction ? null :
      {
        abilityTemplateKey: this.queuedAction.ability.key,
        targetId: this.queuedAction.targetId,
        turnsPrepared: this.queuedAction.turnsPrepared,
        timesInterrupted: this.queuedAction.timesInterrupted,
      },
      isAnnihilated: this.isAnnihilated,
      lastHealthBeforeReceivingDamage: this.lastHealthBeforeReceivingDamage,
    };
  }
}
