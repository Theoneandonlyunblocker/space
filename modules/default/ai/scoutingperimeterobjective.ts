/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Objectives
      {
        export var scoutingPerimeter: Rance.Templates.IObjectiveTemplate =
        {
          key: "scoutingPerimeter",
          movePriority: 7,
          preferredUnitComposition:
          {
            scouting: 1
          },
          moveRoutineFN: AIUtils.moveToRoutine,
          unitDesireFN: AIUtils.scoutingUnitDesireFN,
          unitFitFN: AIUtils.scoutingUnitFitFN,
          creatorFunction: AIUtils.perimeterObjectiveCreation.bind(null, "scoutingPerimeter", true, 0.3),
          unitsToFillObjectiveFN: function(objective: MapAI.Objective)
          {
            return {min: 1, ideal: 1};
          }
        }
      }
    }
  }
}
