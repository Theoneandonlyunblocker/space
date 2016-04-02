import ItemSaveData from "./ItemSaveData.d.ts";

import GuardCoverage from "../GuardCoverage.ts";
import StatusEffect from "../StatusEffect.ts";
import UnitAttributes from "../UnitAttributes.d.ts";

declare interface UnitItemsSaveData
{
  [slot: string]: ItemSaveData;
}
declare interface QueuedActionSaveData
{
  abilityTemplateKey: string;
  targetId: number;
  turnsPrepared: number;
  timesInterrupted: number;
}
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
declare interface UnitSaveData
{
  templateType: string;
  id: number;
  name: string;
  maxHealth: number;
  currentHealth: number;
  currentMovePoints: number;
  maxMovePoints: number;
  timesActedThisTurn: number;
  baseAttributes: UnitAttributes;
  abilityTemplateTypes: string[];
  passiveSkillTemplateTypes: string[];
  experienceForCurrentLevel: number;
  level: number;
  items: UnitItemsSaveData;
  battleStats: UnitBattleStatsSaveData;

  fleetId?: number;
  portraitKey?: string;
}

export default UnitSaveData;
