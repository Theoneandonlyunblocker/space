interface RuleSet
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
    rowsPerFormation?: number; // probably breaks some stuff if not 2
    cellsPerRow?: number;

    maxUnitsPerSide?: number; // TODO | not handled properly for humans
    maxUnitsPerRow?: number; // TODO | not handled properly for humans

    baseMaxCapturedUnits?: number;
    absoluteMaxCapturedUnits?: number;
    baseUnitCaptureChance?: number;

    humanUnitDeathChance?: number;
    aiUnitDeathChance?: number;
    independentUnitDeathChance?: number;
    loserUnitExtraDeathChance?: number;
  }
}

export default RuleSet;

export const defaultRuleSet: RuleSet =
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
    rowsPerFormation: 2,
    cellsPerRow: 3,

    maxUnitsPerSide: 6,
    maxUnitsPerRow: 3,

    baseMaxCapturedUnits: 1,
    absoluteMaxCapturedUnits: 3,
    baseUnitCaptureChance: 0.1,

    humanUnitDeathChance: 0.65,
    aiUnitDeathChance: 0.65,
    independentUnitDeathChance: 1.0,
    loserUnitExtraDeathChance: 0.35
  }
}
