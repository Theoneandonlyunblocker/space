import AbilityBase from "./AbilityBase";
import AbilityTemplate from "./AbilityTemplate";
import {DistributionData} from "./DistributionData";
import ManufacturableThing from "./ManufacturableThing";
import PassiveSkillTemplate from "./PassiveSkillTemplate";
import {ProbabilityDistributions} from "./ProbabilityDistribution";
import SpriteTemplate from "./SpriteTemplate";
import UnitArchetype from "./UnitArchetype";
import UnitDrawingFunction from "./UnitDrawingFunction";


declare interface UnitTemplate extends ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  sprite: SpriteTemplate;
  isSquadron: boolean;
  buildCost: number;
  kind: "unit";
  icon: string;
  /**
   * relative to other unit types. base value is determined in ruleset
   */
  maxHealthLevel: number;
  maxMovePoints: number;
  maxOffensiveBattlesPerTurn: number;

  /**
   * used by the ai to balance unit composition
   */
  archetype: UnitArchetype;

  /**
   * how many stars away unit can see
   * -1: no vision, 0: current star only, 1: current & neighbors, etc.
   */
  visionRange: number;
  /**
   * used for vision on stealthy units. detected units have their type & stats revealed
   * -1: no vision, 0: current star only, 1: current & neighbors, etc.
   */
  detectionRange: number;
  isStealthy?: boolean;

  /**
   * relative to other unit types. base value is determined in ruleset
   */
  attributeLevels:
  {
    attack: number;
    defence: number;
    intelligence: number;
    speed: number;
  };

  possibleAbilities: ProbabilityDistributions<AbilityTemplate>;
  possiblePassiveSkills?: ProbabilityDistributions<PassiveSkillTemplate>;
  /**
   * List of abilities that can be upgraded into even if ability has 'onlyAllowExplicitUpgrade' flag
   */
  specialAbilityUpgrades?: AbilityBase[];
  /**
   * only one of the abilities in a nested array can be learned
   * [canAlwaysLearn, canAlwaysLearn, [#1cantLearnIfHas#2, #2cantLearnIfHas#1]]
   */
  learnableAbilities?: (AbilityBase | AbilityBase[])[];

  itemSlots:
  {
    [slotKey: string]: number;
  };

  unitDrawingFN: UnitDrawingFunction;
  distributionData: DistributionData;
}

export default UnitTemplate;
