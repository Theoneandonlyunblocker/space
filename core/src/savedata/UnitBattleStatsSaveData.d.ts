import {GuardCoverage} from "../unit/GuardCoverage";
import {UnitBattleSide} from "../unit/UnitBattleSide";

import {QueuedActionSaveData} from "./QueuedActionSaveData";
import { CombatEffectManagerSaveData } from "../combat/CombatEffectManagerSaveData";

export interface UnitBattleStatsSaveData
{
  moveDelay: number;
  side: UnitBattleSide | null;
  position: number[] | null;
  currentActionPoints: number;
  guardAmount: number;
  guardCoverage: GuardCoverage | null;
  captureChance: number;
  combatEffects: CombatEffectManagerSaveData;
  queuedAction: QueuedActionSaveData | null;
  isAnnihilated: boolean;
  lastHealthBeforeReceivingDamage: number;
}
