namespace Rance
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
      rowsPerFormation?: number;
      cellsPerRow?: number;

      maxUnitsPerSide?: number;
      maxUnitsPerRow?: number;

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
      rowsPerFormation: 2, // breaks some stuff if not 2
      cellsPerRow: 3,

      maxUnitsPerSide: 6, // not handled properly for humans
      maxUnitsPerRow: 3, // not handled properly for humans

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