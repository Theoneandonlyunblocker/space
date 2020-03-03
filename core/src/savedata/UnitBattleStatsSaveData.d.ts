import {GuardCoverage} from "../unit/GuardCoverage";
import {UnitBattleSide} from "../unit/UnitBattleSide";

import {QueuedActionSaveData} from "./QueuedActionSaveData";
import { CombatEffectMapSaveData } from "../combat/CombatEffectMapSaveData";

export interface UnitBattleStatsSaveData
{
  moveDelay: number;
  side: UnitBattleSide | null;
  position: number[] | null;
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage | null;
  captureChance: number;
  combatEffects: CombatEffectMapSaveData;
  queuedAction: QueuedActionSaveData | null;
  isAnnihilated: boolean;
  lastHealthBeforeReceivingDamage: number;
}
