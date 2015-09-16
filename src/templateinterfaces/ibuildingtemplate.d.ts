declare module Rance
{
  module Templates
  {
    interface IBuildingTemplate
    {
      type: string;
      category: string;
      name: string;
      
      iconSrc: string;
      buildCost: number;
      
      family?: string; // all buildings in same family count towards maxPerType
      maxPerType: number;
      
      maxUpgradeLevel: number;
      upgradeOnly?: boolean;
      upgradeInto?:
      {
        templateType: string;
        level: number;
      }[];
    }
  }
}
