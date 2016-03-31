/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Objectives
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
          unitsToFillObjectiveFN: function(mapEvaluator: MapAI.MapEvaluator, objective: MapAI.Objective)
          {
            return {min: 1, ideal: 1};
          }
        }
      }
    }
  }
}
