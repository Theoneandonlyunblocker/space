import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import ObjectiveTemplate from "./common/ObjectiveTemplate";

import Star from "../../../src/Star";

import
{
  defaultUnitDesireFN,
  defaultUnitFitFN,
  getUnitsToBeatImmediateTarget,
  makeObjectivesFromScores
} from "../aiUtils";
import movePriority from "./common/movePriority";

import
{
  default as musterAndAttack,
  independentTargetFilter
} from "./common/moveroutines/musterAndAttack";

const expansion: ObjectiveTemplate =
{
  key: "expansion",
  movePriority: movePriority.expansion,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1
  },
  moveRoutineFN: musterAndAttack.bind(null, independentTargetFilter),
  unitDesireFN: defaultUnitDesireFN,
  unitFitFN: defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var basePriority = grandStrategyAI.desireForExpansion;

    var independentNeighborStars = mapEvaluator.getIndependentNeighborStars();
    var evaluations = mapEvaluator.evaluateStarTargets(independentNeighborStars);
    var scores = mapEvaluator.scoreIndependentTargets(evaluations);

    const zippedScores = scores.zip<{star: Star, score: number}>("star", "score");

    var template = expansion

    return makeObjectivesFromScores(template, zippedScores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}

export default expansion;
