import MapEvaluator from "../../../src/mapai/MapEvaluator.ts";
import Objective from "../../../src/mapai/Objective.ts";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate.d.ts";

import Unit from "../../../src/Unit.ts";

import
{
  moveToRoutine,
  scoutingUnitDesireFN,
  scoutingUnitFitFN,
  perimeterObjectiveCreation
} from "./aiutils.ts";

const scoutingPerimeter: ObjectiveTemplate =
{
  key: "scoutingPerimeter",
  movePriority: 7,
  preferredUnitComposition:
  {
    scouting: 1
  },
  moveRoutineFN: moveToRoutine,
  unitDesireFN: scoutingUnitDesireFN,
  unitFitFN: scoutingUnitFitFN,
  creatorFunction: null,
  unitsToFillObjectiveFN: function(mapEvaluator: MapEvaluator, objective: Objective)
  {
    return {min: 1, ideal: 1};
  }
}

scoutingPerimeter.creatorFunction = perimeterObjectiveCreation.bind(null, scoutingPerimeter, true, 0.3);

export default scoutingPerimeter;
