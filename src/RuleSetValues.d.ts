export interface RuleSetValues
{
  units:
  {
    baseAttributeValue: number;
    attributeVariance: number;
    baseHealthValue: number;
    healthVariance: number;
  };
  manufactory:
  {
    startingCapacity: number;
    maxCapacity: number;
    buildCost: number;
  };
  research:
  {
    baseResearchPoints: number;
    baseResearchPointsPerStar: number;
  };
  battle:
  {
    rowsPerFormation: number; // probably breaks some stuff if not 2
    cellsPerRow: number;

    maxUnitsPerSide: number; // TODO 2017.04.23 | not handled properly for humans
    maxUnitsPerRow: number; // TODO 2017.04.23 | not handled properly for humans

    baseMaxCapturedUnits: number;
    absoluteMaxCapturedUnits: number;
    baseUnitCaptureChance: number;

    humanUnitDeathChance: number;
    aiUnitDeathChance: number;
    independentUnitDeathChance: number;
    loserUnitExtraDeathChance: number;
  };
  vision:
  {
    baseStarDetectionRange: number;
    baseStarVisionRange: number;
  };
}

export type PartialRuleSetValues =
{
  [category in keyof RuleSetValues]?: Partial<RuleSetValues[category]>;
};
