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
    }
  }
}