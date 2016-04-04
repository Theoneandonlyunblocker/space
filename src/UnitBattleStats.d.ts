import QueuedActionData from "./QueuedActionData.d.ts";
import UnitBattleSide from "./UnitBattleSide.ts";
import GuardCoverage from "./GuardCoverage.ts";
import StatusEffect from "./StatusEffect.ts";

declare interface UnitBattleStats
{
  moveDelay: number;
  side: UnitBattleSide;
  position: number[];
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage;
  captureChance: number;
  statusEffects: StatusEffect[];
  lastHealthBeforeReceivingDamage: number;
  queuedAction: QueuedActionData;
  isAnnihilated: boolean;
}

export default UnitBattleStats;
