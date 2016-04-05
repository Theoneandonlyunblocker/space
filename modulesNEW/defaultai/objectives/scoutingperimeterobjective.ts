/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

import MapEvaluator from "../../../src/mapai/MapEvaluator.ts"; // TODO refactor | autogenerated

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate.d.ts"; // TODO refactor | autogenerated

import Objective from "../../../src/mapai/Objective.ts"; // TODO refactor | autogenerated

import Unit from "../../../src/Unit.ts"; // TODO refactor | autogenerated



export var scoutingPerimeter: ObjectiveTemplate =
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
  creatorFunction: perimeterObjectiveCreation.bind(null, "scoutingPerimeter", true, 0.3),
  unitsToFillObjectiveFN: function(mapEvaluator: MapEvaluator, objective: Objective)
  {
    return {min: 1, ideal: 1};
  }
}
