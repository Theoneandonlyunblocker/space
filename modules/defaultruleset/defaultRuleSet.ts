import RuleSet from "../../src/RuleSet";
import ModuleFile from "../../src/ModuleFile";

const defaultRuleSet: ModuleFile =
{
  key: "defaultRuleSet",
  metaData:
  {
    name: "Default Ruleset",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  ruleSet:
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
}

export default defaultRuleSet;
