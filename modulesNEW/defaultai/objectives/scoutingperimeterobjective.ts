/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="ts" />

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
