/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="ts" />

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
  moveRoutineFN: musterAndAttackRoutine.bind(null, independentTargetFilter),
  unitDesireFN: defaultUnitDesireFN,
  unitFitFN: defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var basePriority = grandStrategyAI.desireForExpansion;

    var independentNeighborStars = mapEvaluator.getIndependentNeighborStars();
    var evaluations = mapEvaluator.evaluateIndependentTargets(independentNeighborStars);
    var scores = mapEvaluator.scoreIndependentTargets(evaluations);

    var template = Modules.DefaultModule.Objectives.expansion;

    return makeObjectivesFromScores(template, scores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}
