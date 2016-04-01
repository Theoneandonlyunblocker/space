/// <reference path="imanufacturablething.d.ts" />

declare namespace Rance
{
  namespace Templates
  {
    interface IItemTemplate extends IManufacturableThing
    {
      type: string;
      displayName: string;
      description: string;
      icon: string;
      
      techLevel: number;
      
      slot: string; // low, mid, high
      
      buildCost: number;
      
      ability?: IAbilityTemplate;
      passiveSkill?: IPassiveSkillTemplate;
      attributes?:
      {
        maxActionPoints?: number;
        attack?: number;
        defence?: number;
        intelligence?: number;
        speed?: number;
      };

      technologyRequirements?: ITechnologyRequirement[];
    }
  }
}
