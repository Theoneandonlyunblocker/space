import {UnitAttributesObject} from "../UnitAttributes";

import ItemSaveData from "./ItemSaveData";
import UnitItemsSaveData from "./UnitItemsSaveData";
import UnitBattleStatsSaveData from "./UnitBattleStatsSaveData";

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
  baseAttributes: UnitAttributesObject;
  abilityTemplateTypes: string[];
  passiveSkillTemplateTypes: string[];
  experienceForCurrentLevel: number;
  level: number;
  items: UnitItemsSaveData;
  battleStats: UnitBattleStatsSaveData;

  // Only used for creating virtual clones of unit.
  // When saving & loading items are stored by player save data.
  serializedItems?: ItemSaveData[];
  
  fleetId?: number;
  portraitKey?: string;
}

export default UnitSaveData;
