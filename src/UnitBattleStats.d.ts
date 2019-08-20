import {GuardCoverage} from "./GuardCoverage";
import {QueuedActionData} from "./QueuedActionData";
import {StatusEffect} from "./StatusEffect";
import {UnitBattleSide} from "./UnitBattleSide";

export interface UnitBattleStats
{
  /**
   * 0 - Infinity
   * 100 is the baseline for ability usage
   */
  moveDelay: number;
  side: UnitBattleSide | null;
  position: number[] | null;
  currentActionPoints: number;
  /**
   * 0 - Infinity
   * 1 = 1% chance to guard
   */
  guardAmount: number;
  guardCoverage: GuardCoverage | null;
  /**
   * 0.0 - Infinity
   * 0.01 = 1% chance to capture
   * units with the highest capture chance are prioritized if # of captures are limited
   */
  captureChance: number;
  statusEffects: StatusEffect[];
  lastHealthBeforeReceivingDamage: number;
  queuedAction: QueuedActionData | null;
  isAnnihilated: boolean;
}
