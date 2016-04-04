import UnitBattleSide from "../UnitBattleSide.ts";
import GuardCoverage from "../GuardCoverage.ts";
import StatusEffect from "../StatusEffect.ts";

import QueuedActionSaveData from "./QueuedActionSaveData.d.ts";

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
