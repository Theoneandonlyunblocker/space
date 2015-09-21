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
        export var discovery: Rance.Templates.IObjectiveTemplate =
        {
          preferredUnitComposition:
          {
            "scouting": 1
          },
          moveRoutine: AIUtils.moveToRoutine,
          unitFit: function(unit: Unit, front: MapAI.Front)
          {
            return 1;
          },
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator)
          {
            return [];
          },
          unitsToFillObjective: function(objective: MapAI.Objective)
          {
            return {min: 1, ideal: 1};
          }
        }
      }
    }
  }
}
