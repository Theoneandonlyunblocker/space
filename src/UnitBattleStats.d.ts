import QueuedActionData from "./QueuedActionData";
import UnitBattleSide from "./UnitBattleSide";
import GuardCoverage from "./GuardCoverage";
import StatusEffect from "./StatusEffect";

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
