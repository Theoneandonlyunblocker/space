import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import ObjectivesAI from "../mapai/ObjectivesAI";

import ObjectiveTemplate from "./common/ObjectiveTemplate";

import Star from "../../../src/Star";

import
{
  defaultUnitDesireFN,
  defaultUnitFitFN,
  getUnitsToBeatImmediateTarget,
  makeObjectivesFromScores,
} from "../aiUtils";
import movePriority from "./common/movePriority";
import musterAndAttack from "./common/moveroutines/musterAndAttack";

const fightInvadingEnemy: ObjectiveTemplate =
{
  key: "fightInvadingEnemy",
  movePriority: movePriority.fightInvadingEnemy,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1,
  },
  moveRoutineFN: musterAndAttack.bind(null, null),
  unitDesireFN: defaultUnitDesireFN,
  unitFitFN: defaultUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI)
  {
    const basePriority = grandStrategyAI.desireForConsolidation;


    const ownedStarsWithInvaders = mapEvaluator.player.controlledLocations.filter(star =>
    {
      const hostileUnits = star.getUnits(player =>
      {
        return(
          !player.isIndependent &&
          mapEvaluator.player.diplomacyStatus.canAttackFleetOfPlayer(player)
        );
      });

      return hostileUnits.length > 0;
    });


    const evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithInvaders);
    const scores = mapEvaluator.scoreStarTargets(evaluations, (star, evaluation) =>
    {
      const strengthRatio = evaluation.ownInfluence / evaluation.hostileStrength;
      const score = evaluation.desirability * strengthRatio;

      return score;
    });
    const zippedScores = scores.zip<{star: Star, score: number}>("star", "score");

    const template = fightInvadingEnemy;

    return makeObjectivesFromScores(template, zippedScores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget,
};

export default fightInvadingEnemy;
