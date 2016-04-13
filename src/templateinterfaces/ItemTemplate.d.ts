import ManufacturableThing from "./ManufacturableThing";
import AbilityTemplate from "./AbilityTemplate";
import PassiveSkillTemplate from "./PassiveSkillTemplate";

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
  attributes?:
  {
    maxActionPoints?: number;
    attack?: number;
    defence?: number;
    intelligence?: number;
    speed?: number;
  };
}

export default ItemTemplate;
