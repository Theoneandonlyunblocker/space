module Rance
{
  export interface IModuleRuleSet
  {
    manufactory?:
    {
      startingCapacity?: number;
      maxCapacity?: number;
      buildCost?: number;
    }
    research?:
    {
      baseResearchSpeed?: number;
    }
    battle?:
    {
      baseMaxCapturedUnits?: number;
      absoluteMaxCapturedUnits?: number;
      baseUnitCaptureChance?: number;

      humanUnitDeathChance?: number;
      aiUnitDeathChance?: number;
      independentUnitDeathChance?: number;
      loserUnitExtraDeathChance?: number;
    }
  }

  export var defaultRuleSet: IModuleRuleSet =
  {
    manufactory:
    {
      startingCapacity: 1,
      maxCapacity: 3,
      buildCost: 1000
    },
    research:
    {
      baseResearchSpeed: 3000
    },
    battle:
    {
      baseMaxCapturedUnits: 1,
      absoluteMaxCapturedUnits: 3,
      baseUnitCaptureChance: 0.1,

      humanUnitDeathChance: 0.65,
      aiUnitDeathChance: 0.65,
      independentUnitDeathChance: 1.0,
      loserUnitExtraDeathChance: 0.35
    }
  }
}