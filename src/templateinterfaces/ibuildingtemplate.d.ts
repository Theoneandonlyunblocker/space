/// <reference path="ibuildingeffect.d.ts" />

declare module Rance
{
  module Templates
  {
    interface IBuildingTemplate
    {
      type: string;
      category: string;
      displayName: string;
      
      iconSrc: string;
      buildCost: number;
      
      family?: string; // all buildings in same family count towards maxPerType
      maxPerType: number;

      effect?: IBuildingEffect;
      // if not specified, upgradeLevel is used as multiplier instead
      effectMultiplierFN?: (upgradeLevel: number) => number;
      
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
