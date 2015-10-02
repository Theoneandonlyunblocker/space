declare module Rance
{
  module Templates
  {
    interface IItemTemplate
    {
      type: string;
      displayName: string;
      description?: string;
      icon: string;
      
      techLevel: number;
      
      slot: string; // low, mid, high
      
      cost: number;
      
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
