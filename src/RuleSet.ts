import
{
  deepMerge
} from "./utility";
import RuleSetValues from "./RuleSetValues";

const defaultRuleSet: RuleSetValues =
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

class RuleSet implements RuleSetValues
{
  public manufactory:
  {
    startingCapacity: number;
    maxCapacity: number;
    buildCost: number;
  }
  public research:
  {
    baseResearchSpeed: number;
  }
  public battle:
  {
    rowsPerFormation: number;
    cellsPerRow: number;

    maxUnitsPerSide: number;
    maxUnitsPerRow: number;

    baseMaxCapturedUnits: number;
    absoluteMaxCapturedUnits: number;
    baseUnitCaptureChance: number;

    humanUnitDeathChance: number;
    aiUnitDeathChance: number;
    independentUnitDeathChance: number;
    loserUnitExtraDeathChance: number;
  }
  
  private validCategories =
  {
    manufactory: true,
    battle: true,
    research: true,
  }
  
  constructor()
  {
    
  }
  public copyRules(toCopy: RuleSetValues)
  {
    for (let category in toCopy)
    {
      if (this.validCategories[category])
      {
        this[category] = deepMerge(this[category], toCopy[category]);
      }
      else
      {
        console.warn("Invalid ruleset category " + category + ". Category must be one of: [" +
          Object.keys(this.validCategories).join(", ") + "].");
      }
    }
  }
}

const ruleSet = new RuleSet();
export default ruleSet;
