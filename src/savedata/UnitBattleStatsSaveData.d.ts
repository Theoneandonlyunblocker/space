import UnitBattleSide from "../UnitBattleSide";
import GuardCoverage from "../GuardCoverage";
import StatusEffect from "../StatusEffect";

import QueuedActionSaveData from "./QueuedActionSaveData";

declare interface UnitBattleStatsSaveData
{
  moveDelay: number;
  side: UnitBattleSide;
  position: number[];
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage;
  captureChance: number;
  statusEffects: StatusEffect[];
  queuedAction: QueuedActionSaveData;
  isAnnihilated: boolean;
}

export default UnitBattleStatsSaveData;
