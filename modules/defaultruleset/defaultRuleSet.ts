import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";


const defaultRuleSet: ModuleFile =
{
  metaData:
  {
    key: "defaultRuleSet",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: "all",
  constructModule: (moduleData) =>
  {
    moduleData.ruleSet =
    {
      units:
      {
        baseAttributeValue: 5,
        attributeVariance: 1.2,
        baseHealthValue: 250,
        healthVariance: 50,
      },
      manufactory:
      {
        startingCapacity: 1,
        maxCapacity: 3,
        buildCost: 1000,
      },
      research:
      {
        baseResearchPoints: 3000,
        baseResearchPointsPerStar: 0,
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
        loserUnitExtraDeathChance: 0.35,
      },
      vision:
      {
        baseStarVisionRange: 1,
        baseStarDetectionRange: 0,
      }
    };
  },
};

export default defaultRuleSet;
