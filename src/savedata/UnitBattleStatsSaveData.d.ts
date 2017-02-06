import GuardCoverage from "../GuardCoverage";
import UnitBattleSide from "../UnitBattleSide";

import QueuedActionSaveData from "./QueuedActionSaveData";
import {StatusEffectSaveData} from "./StatusEffectSaveData";

declare interface UnitBattleStatsSaveData
{
  moveDelay: number;
  side: UnitBattleSide;
  position: number[];
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage;
  captureChance: number;
  statusEffects: StatusEffectSaveData[];
  queuedAction: QueuedActionSaveData;
  isAnnihilated: boolean;
}

export default UnitBattleStatsSaveData;
