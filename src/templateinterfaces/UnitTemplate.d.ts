import AbilityBase from "./AbilityBase";
import AbilityTemplate from "./AbilityTemplate";
import {DistributionData} from "./DistributionData";
import ManufacturableThing from "./ManufacturableThing";
import PassiveSkillTemplate from "./PassiveSkillTemplate";
import {ProbabilityDistributions} from "./ProbabilityDistribution";
import UnitArchetype from "./UnitArchetype";
import UnitDrawingFunction from "./UnitDrawingFunction";


declare interface UnitTemplate extends ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  isSquadron: boolean;
  buildCost: number;
  // TODO 2018.12.20 | return element instead
  getIconSrc: () => string;
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
  // will fall back on AbilityBase.defaultUpgrades if not specified for an ability
  possibleAbilityUpgrades?:
  {
    [abilityType: string]: (beingUpgraded: AbilityBase) => ProbabilityDistributions<AbilityBase>,
  };
  possibleLearnableAbilities?: ProbabilityDistributions<AbilityBase>;

  itemSlots:
  {
    [slotKey: string]: number;
  };

  unitDrawingFN: UnitDrawingFunction;
  distributionData: DistributionData;
}

export default UnitTemplate;
