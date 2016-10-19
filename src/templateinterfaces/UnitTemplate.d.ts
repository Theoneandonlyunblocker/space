import AbilityBase from "./AbilityBase";
import AbilityTemplate from "./AbilityTemplate";
import ManufacturableThing from "./ManufacturableThing";
import PassiveSkillTemplate from "./PassiveSkillTemplate";
import SpriteTemplate from "./SpriteTemplate";
import UnitArchetype from "./UnitArchetype";
import UnitDrawingFunction from "./UnitDrawingFunction";
import WeightedProbability from "./WeightedProbability";


declare interface UnitTemplate extends ManufacturableThing
{
  type: string;
  displayName: string;
  description: string;
  sprite: SpriteTemplate;
  isSquadron: boolean;
  buildCost: number;
  icon: string;
  maxHealth: number;
  maxMovePoints: number;
  
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
   * 
   */
  /**
   * used for vision on stealthy units. detected units have their type & stats revealed
   * -1: no vision, 0: current star only, 1: current & neighbors, etc.
   */
  detectionRange: number;
  isStealthy?: boolean;
  
  attributeLevels:
  {
    attack: number;
    defence: number;
    intelligence: number;
    speed: number;
  };

  possibleAbilities: WeightedProbability<AbilityTemplate>[];
  possiblePassiveSkills?: WeightedProbability<PassiveSkillTemplate>[];
  /**
   * List of abilities that can be upgraded into despite 'onlyAllowExplicitUpgrade' flag
   */
  specialAbilityUpgrades?: AbilityBase[];
  /**
   * only one of the abilities in a nested array can be learned f.ex.
   * [canAlwaysLearn, canAlwaysLearn, [#1cantLearnIfHas#2, #2cantLearnIfHas#1]]
   */
  learnableAbilities?: Array<AbilityBase | AbilityBase[]>;

  itemSlots:
  {
    [slotKey: string]: number;
  };

  unitDrawingFN: UnitDrawingFunction;
}

export default UnitTemplate;
