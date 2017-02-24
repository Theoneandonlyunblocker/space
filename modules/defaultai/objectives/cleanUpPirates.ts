import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import ObjectivesAI from "../mapai/ObjectivesAI";

import ObjectiveTemplate from "./common/ObjectiveTemplate";

import Star from "../../../src/Star";

import
{
  defaultUnitDesireFN,
  getUnitsToBeatImmediateTarget,
  makeObjectivesFromScores,
} from "../aiUtils";
import movePriority from "./common/movePriority";
import
{
  default as musterAndAttack,
  independentTargetFilter,
} from "./common/moveroutines/musterAndAttack";

const cleanUpPirates: ObjectiveTemplate =
{
  key: "cleanUpPirates",
  movePriority: movePriority.cleanUpPirates,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1,
  },
  moveRoutineFN: musterAndAttack.bind(null, independentTargetFilter),
  unitDesireFN: defaultUnitDesireFN,
  unitFitFN: defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI)
  {
    const basePriority = grandStrategyAI.desireForExpansion;

    const ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(function(star: Star)
    {
      if (star.getSecondaryController)
      {
        return false;
      }
      else
      {
        return star.getUnits(player => player.isIndependent).length > 0;
      }
    });

    const evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithPirates);
    const scores = mapEvaluator.scoreIndependentTargets(evaluations);
    const zippedScores = scores.zip<{star: Star, score: number}>("star", "score");

    const template = cleanUpPirates;

    return makeObjectivesFromScores(template, zippedScores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget,
};

export default cleanUpPirates;
