import {UnitAttributesObject} from "../unit/UnitAttributes";

import {UnitBattleStatsSaveData} from "./UnitBattleStatsSaveData";
import {UnitItemsSaveData} from "./UnitItemsSaveData";
import { AbilityUpgradeSaveData } from "../abilities/UpgradableAbilitiesData";
import { NameSaveData } from "./NameSaveData";

export interface UnitSaveData
{
  template: string;
  id: number;
  name: NameSaveData;
  maxHealth: number;
  currentHealth: number;
  currentMovePoints: number;
  maxMovePoints: number;
  offensiveBattlesFoughtThisTurn: number;
  baseAttributes: UnitAttributesObject;
  abilities: string[];
  passiveSkills: string[];
  abilityUpgrades: AbilityUpgradeSaveData[];
  learnableAbilities: string[];
  experienceForCurrentLevel: number;
  level: number;
  items: UnitItemsSaveData;
  battleStats: UnitBattleStatsSaveData;

  fleetId?: number;
  portrait?: string;
  race?: string;
}
