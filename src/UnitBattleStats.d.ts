import GuardCoverage from "./GuardCoverage";
import QueuedActionData from "./QueuedActionData";
import StatusEffect from "./StatusEffect";
import UnitBattleSide from "./UnitBattleSide";

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
