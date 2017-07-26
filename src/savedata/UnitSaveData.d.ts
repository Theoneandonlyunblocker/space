import {UnitAttributesObject} from "../UnitAttributes";

import UnitBattleStatsSaveData from "./UnitBattleStatsSaveData";
import UnitItemsSaveData from "./UnitItemsSaveData";

declare interface UnitSaveData
{
  templateType: string;
  id: number;
  name: string;
  maxHealth: number;
  currentHealth: number;
  currentMovePoints: number;
  maxMovePoints: number;
  offensiveBattlesFoughtThisTurn: number;
  baseAttributes: UnitAttributesObject;
  abilityTemplateTypes: string[];
  passiveSkillTemplateTypes: string[];
  experienceForCurrentLevel: number;
  level: number;
  items: UnitItemsSaveData;
  battleStats: UnitBattleStatsSaveData;

  fleetId?: number;
  portraitKey?: string;
  raceKey?: string;
}

export default UnitSaveData;
