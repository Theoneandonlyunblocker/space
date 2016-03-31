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
          moveRoutineFN: AIUtils.musterAndAttackRoutine.bind(null, AIUtils.independentTargetFilter),
          unitDesireFN: AIUtils.defaultUnitDesireFN,
          unitFitFN: AIUtils.defaultUnitFitFN,
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator, objectivesAI: MapAI.ObjectivesAI)
          {
            var basePriority = grandStrategyAI.desireForExpansion;

            var ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(function(star: Star)
            {
              return star.getIndependentUnits().length > 0 && !star.getSecondaryController();
            });

            var evaluations = mapEvaluator.evaluateIndependentTargets(ownedStarsWithPirates);
            var scores = mapEvaluator.scoreIndependentTargets(evaluations);

            var template = Rance.Modules.DefaultModule.Objectives.cleanUpPirates;

            return AIUtils.makeObjectivesFromScores(template, scores, basePriority);
          },
          unitsToFillObjectiveFN: AIUtils.getUnitsToBeatImmediateTarget
        }
      }
    }
  }
}
