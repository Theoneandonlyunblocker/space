/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

export var expansion: ObjectiveTemplate =
{
  key: "expansion",
  movePriority: 4,
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
    mapEvaluator: MapAI.MapEvaluator)
  {
    var basePriority = grandStrategyAI.desireForExpansion;

    var independentNeighborStars = mapEvaluator.getIndependentNeighborStars();
    var evaluations = mapEvaluator.evaluateIndependentTargets(independentNeighborStars);
    var scores = mapEvaluator.scoreIndependentTargets(evaluations);

    var template = Modules.DefaultModule.Objectives.expansion;

    return AIUtils.makeObjectivesFromScores(template, scores, basePriority);
  },
  unitsToFillObjectiveFN: AIUtils.getUnitsToBeatImmediateTarget
}
