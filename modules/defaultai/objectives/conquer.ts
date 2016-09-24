import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import ObjectivesAI from "../mapai/ObjectivesAI";

import ObjectiveTemplate from "./common/ObjectiveTemplate";

import Star from "../../../src/Star";

import movePriority from "./common/movePriority";
import
{
  defaultUnitDesireFN,
  defaultUnitFitFN,
  getUnitsToBeatImmediateTarget,
  makeObjectivesFromScores
} from "../aiUtils";

import
{
  default as musterAndAttack,
  buildingControllerFilter
} from "./common/moveroutines/musterAndAttack";

const conquer: ObjectiveTemplate =
{
  key: "conquer",
  movePriority: movePriority.conquer,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1
  },
  moveRoutineFN: musterAndAttack.bind(null, buildingControllerFilter),
  unitDesireFN: defaultUnitDesireFN,
  unitFitFN: defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI)
  {
    const basePriority = grandStrategyAI.desireForExpansion;
    var possibleTargets: Star[] = mapEvaluator.player.getNeighboringStars().filter(star =>
    {
      if (!mapEvaluator.player.starIsRevealed(star))
      {
        return false;
      }

      return star.hasBuildingTargetForPlayer(mapEvaluator.player);
    });

    const evaluations = mapEvaluator.evaluateStarTargets(possibleTargets);
    const scores = mapEvaluator.scoreStarTargets(evaluations, (star, evaluation) =>
    {
      const strengthRatio = evaluation.ownInfluence / evaluation.hostileStrength;
      const score = evaluation.desirability * strengthRatio;

      return score;
    });
    const zippedScores = scores.zip<{star: Star, score: number}>("star", "score");


    var template = conquer;
    return makeObjectivesFromScores(template, zippedScores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}

export default conquer;
