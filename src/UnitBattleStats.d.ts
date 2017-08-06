import GuardCoverage from "./GuardCoverage";
import QueuedActionData from "./QueuedActionData";
import StatusEffect from "./StatusEffect";
import UnitBattleSide from "./UnitBattleSide";

declare interface UnitBattleStats
{
  moveDelay: number;
  side: UnitBattleSide | null;
  position: number[] | null;
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage | null;
  captureChance: number;
  statusEffects: StatusEffect[];
  lastHealthBeforeReceivingDamage: number;
  queuedAction: QueuedActionData | null;
  isAnnihilated: boolean;
}

export default UnitBattleStats;
