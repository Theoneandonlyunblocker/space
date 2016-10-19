declare interface RuleSetValues
{
  units?:
  {
    baseAttributeValue?: number;
    attributeVariance?: number;
    baseHealthValue?: number;
    healthVariance?: number;
  }
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

export default RuleSetValues;
