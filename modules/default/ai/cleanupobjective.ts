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
        export var cleanUpPirates: Rance.Templates.IObjectiveTemplate =
        {
          key: "cleanUpPirates",
          movePriority: 3,
          preferredUnitComposition:
          {
            combat: 0.65,
            defence: 0.25,
            utility: 0.1
          },
          moveRoutineFN: AIUtils.musterAndAttackRoutine,
          unitDesireFN: AIUtils.defaultUnitDesireFN,
          unitFitFN: AIUtils.defaultUnitFitFN,
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator, objectivesAI: MapAI.ObjectivesAI)
          {
            var basePriority = grandStrategyAI.desireForExpansion;

            var ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(function(star: Star)
            {
              return star.getIndependentShips().length > 0 && !star.getSecondaryController();
            });

            var evaluations = mapEvaluator.evaluateIndependentTargets(ownedStarsWithPirates);
            var scores = mapEvaluator.scoreIndependentTargets(evaluations);

            var template = Rance.Modules.DefaultModule.Objectives.cleanUpPirates;

            return AIUtils.makeObjectivesFromScores(template, scores, basePriority);
          },
          unitsToFillObjectiveFN: AIUtils.getUnitsToFillIndependentObjective
        }
      }
    }
  }
}
