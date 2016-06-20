import ManufacturableThing from "./ManufacturableThing";
import AbilityTemplate from "./AbilityTemplate";
import PassiveSkillTemplate from "./PassiveSkillTemplate";

import {UnitAttributeAdjustments} from "../UnitAttributes";

declare interface ItemTemplate extends ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  icon: string;
  
  techLevel: number;
  
  slot: string; // low, mid, high
  
  buildCost: number;
  
  ability?: AbilityTemplate;
  passiveSkill?: PassiveSkillTemplate;
  attributeAdjustments?: UnitAttributeAdjustments;
}

export default ItemTemplate;
