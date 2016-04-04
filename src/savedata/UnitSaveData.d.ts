import UnitAttributes from "../UnitAttributes.d.ts";

import UnitItemsSaveData from "./UnitItemsSaveData.d.ts";
import UnitBattleStatsSaveData from "./UnitBattleStatsSaveData.d.ts";

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
