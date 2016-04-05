import GrandStrategyAI from "../../../src/mapai/GrandStrategyAI.ts";
import MapEvaluator from "../../../src/mapai/MapEvaluator.ts";
import Objective from "../../../src/mapai/Objective.ts";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate.d.ts";

import Star from "../../../src/Star.ts";
import Unit from "../../../src/Unit.ts";

import
{
  musterAndAttackRoutine,
  independentTargetFilter,
  defaultUnitDesireFN,
  defaultUnitFitFN,
  makeObjectivesFromScores,
  getUnitsToBeatImmediateTarget
} from "./aiutils.ts";

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
