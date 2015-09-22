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
        export var expansion: Rance.Templates.IObjectiveTemplate =
        {
          key: "expansion",
          movePriority: 4,
          preferredUnitComposition:
          {
            combat: 1,
            defence: 0.65,
            utility: 0.3
          },
          moveRoutineFN: AIUtils.musterAndAttackRoutine,
          unitDesireFN: AIUtils.defaultUnitDesireFN,
          unitFitFN: AIUtils.defaultUnitFitFN,
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator)
          {
            var basePriority = grandStrategyAI.desireForExpansion;

            var ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(function(star: Star)
            {
              return star.getIndependentShips().length > 0 && !star.getSecondaryController();
            });

            var evaluations = mapEvaluator.evaluateIndependentTargets(ownedStarsWithPirates);
            var scores = mapEvaluator.scoreIndependentTargets(evaluations);

            return AIUtils.makeObjectivesFromScores("expansion", scores, basePriority);
          },
          unitsToFillObjectiveFN: AIUtils.getUnitsToFillIndependentObjective
        }
      }
    }
  }
}
