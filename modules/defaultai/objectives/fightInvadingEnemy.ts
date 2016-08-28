import GrandStrategyAI from "../../../src/mapai/GrandStrategyAI";
import MapEvaluator from "../../../src/mapai/MapEvaluator";
import Objective from "../../../src/mapai/Objective";
import ObjectivesAI from "../../../src/mapai/ObjectivesAI";

import ObjectiveTemplate from "../../../src/templateinterfaces/ObjectiveTemplate";

import Star from "../../../src/Star";
import Unit from "../../../src/Unit";

import movePriority from "./common/movePriority";
import
{
  defaultUnitDesireFN,
  defaultUnitFitFN,
  makeObjectivesFromScores,
  getUnitsToBeatImmediateTarget
} from "../aiUtils";
import
{
  default as musterAndAttack,
  independentTargetFilter
} from "./common/moveroutines/musterAndAttack";

const fightInvadingEnemy: ObjectiveTemplate =
{
  key: "fightInvadingEnemy",
  movePriority: movePriority.fightInvadingEnemy,
  preferredUnitComposition:
  {
    combat: 0.65,
    defence: 0.25,
    utility: 0.1
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
        return mapEvaluator.player.diplomacyStatus.canAttackFleetOfPlayer(player);
      });

      return hostileUnits.length > 0;
    });



    const evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithInvaders);
    const scores = evaluations.zip<{star: Star, score: number}>("star", "score");

    const template = fightInvadingEnemy;

    return makeObjectivesFromScores(template, scores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}

export default fightInvadingEnemy;
