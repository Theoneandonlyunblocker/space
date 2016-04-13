import GrandStrategyAI from "../../../src/mapai/GrandStrategyAI";
import MapEvaluator from "../../../src/mapai/MapEvaluator";
import Objective from "../../../src/mapai/Objective";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";

import
{
  musterAndAttackRoutine,
  independentTargetFilter,
  defaultUnitDesireFN,
  defaultUnitFitFN,
  makeObjectivesFromScores,
  getUnitsToBeatImmediateTarget
} from "../aiUtils";

const expansion: ObjectiveTemplate =
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

    var template = expansion

    return makeObjectivesFromScores(template, scores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}

export default expansion;
