import MapEvaluator from "../../../src/mapai/MapEvaluator";
import Objective from "../../../src/mapai/Objective";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate";

import Unit from "../../../src/Unit";

import movePriority from "./common/movePriority";
import
{
  moveToRoutine,
  scoutingUnitDesireFN,
  scoutingUnitFitFN,
  perimeterObjectiveCreation
} from "../aiUtils";

const scoutingPerimeter: ObjectiveTemplate =
{
  key: "scoutingPerimeter",
  movePriority: movePriority.scoutingPerimeter,
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
