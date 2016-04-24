import AbilityBase from "./AbilityBase";
import AbilityTemplate from "./AbilityTemplate";
import CultureTemplate from "./CultureTemplate";
import ManufacturableThing from "./ManufacturableThing";
import PassiveSkillTemplate from "./PassiveSkillTemplate";
import SpriteTemplate from "./SpriteTemplate";
import UnitArchetype from "./UnitArchetype";
import UnitDrawingFunction from "./UnitDrawingFunction";
import UnitFamily from "./UnitFamily";
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
  
  // archetype is used by the ai to balance unit composition
  archetype: UnitArchetype;
  // family is used to group units for local specialties and AI favorites
  // f.ex. sector specializes in producing units with beam weapons
  families : UnitFamily[];
  // culture is used for portrait and name
  cultures: CultureTemplate[];
  
  // how many stars away unit can see
  // -1: no vision, 0: current star only, 1: current & 1 away etc.
  visionRange: number;
  // like vision but for stealthy units. also reveals unit type & health etc.
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
  specialAbilityUpgrades?: AbilityBase[];
  // only one of the abilities in a nested array can be learned f.ex.
  // [canAlwaysLearn, canAlwaysLearn, [#1cantLearnIfHas#2, #2cantLearnIfHas#1]]
  learnableAbilities?: Array<AbilityBase | AbilityBase[]>;

  unitDrawingFN: UnitDrawingFunction;
}

export default UnitTemplate;
