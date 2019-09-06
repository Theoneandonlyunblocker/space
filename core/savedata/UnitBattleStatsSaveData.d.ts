import {GuardCoverage} from "../unit/GuardCoverage";
import {UnitBattleSide} from "../unit/UnitBattleSide";

import {QueuedActionSaveData} from "./QueuedActionSaveData";
import {StatusEffectSaveData} from "./StatusEffectSaveData";

export interface UnitBattleStatsSaveData
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
