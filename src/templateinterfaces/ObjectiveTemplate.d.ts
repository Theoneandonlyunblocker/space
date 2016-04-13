import RoutineAdjustment from "./RoutineAdjustment";
import RoutineAdjustmentByID from "./RoutineAdjustmentByID";

import ArchetypeValues from "../ArchetypeValues";
import Star from "../Star";
import Player from "../Player";
import Unit from "../Unit";

import Front from "../mapai/Front";
import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import Objective from "../mapai/Objective";
import ObjectivesAI from "../mapai/ObjectivesAI";
import EconomyAI from "../mapai/EconomyAI";
import DiplomacyAI from "../mapai/DiplomacyAI";


declare interface ObjectiveTemplate
{
  key: string;
  creatorFunction: (grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI) => Objective[];

  movePriority?: number;
  preferredUnitComposition?: ArchetypeValues;
  // moveRoutine
  moveRoutineFN?: (front: Front, afterMoveCallback: () => void) => void;
  // both this and unitFitFN should usually return 0.0..1.0
  // values higher than 1 should only be used to prioritize units already part of the front
  // how much front with this objective wants units
  unitDesireFN?: (front: Front) => number;
  // how well individual unit fits into front
  unitFitFN?: (unit: Unit, front: Front) => number;
  // unitsToFillObjective
  unitsToFillObjectiveFN?: (mapEvaluator: MapEvaluator,
    objective: Objective) => {min: number; ideal: number};

  economyRoutineFN?: (objective: Objective, economyAI: EconomyAI,
    adjustments: RoutineAdjustmentByID) => void;
  diplomacyRoutineFN?: (objective: Objective, diplomacyAI: DiplomacyAI,
    adjustments: RoutineAdjustmentByID, afterDoneCallback: () => void) => void;

  // applies to all current objectives
  // f.ex. don't go through star, try to trade with particular player
  moveRoutineAdjustments?: RoutineAdjustment[];
  economyRoutineAdjustments?: RoutineAdjustment[];
  diplomacyRoutineAdjustments?: RoutineAdjustment[];
}

export default ObjectiveTemplate;
