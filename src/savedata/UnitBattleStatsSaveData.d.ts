import GuardCoverage from "../GuardCoverage";
import UnitBattleSide from "../UnitBattleSide";

import QueuedActionSaveData from "./QueuedActionSaveData";
import {StatusEffectSaveData} from "./StatusEffectSaveData";

declare interface UnitBattleStatsSaveData
{
  moveDelay: number;
  side: UnitBattleSide | null;
  position: number[] | null;
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage | null;
  captureChance: number;
  statusEffects: StatusEffectSaveData[];
  queuedAction: QueuedActionSaveData | null;
  isAnnihilated: boolean;
}

export default UnitBattleStatsSaveData;
