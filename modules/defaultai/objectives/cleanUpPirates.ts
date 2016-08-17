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
  musterAndAttackRoutine,
  independentTargetFilter,
  defaultUnitDesireFN,
  defaultUnitFitFN,
  makeObjectivesFromScores,
  getUnitsToBeatImmediateTarget
} from "../aiUtils";

const cleanUpPirates: ObjectiveTemplate =
{
  key: "cleanUpPirates",
  movePriority: movePriority.cleanUpPirates,
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
    mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI)
  {
    var basePriority = grandStrategyAI.desireForExpansion;

    var ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(function(star: Star)
    {
      return star.getIndependentUnits().length > 0 && !star.getSecondaryController();
    });

    var evaluations = mapEvaluator.evaluateIndependentTargets(ownedStarsWithPirates);
    var scores = mapEvaluator.scoreIndependentTargets(evaluations);

    var template = cleanUpPirates;

    return makeObjectivesFromScores(template, scores, basePriority);
  },
  unitsToFillObjectiveFN: getUnitsToBeatImmediateTarget
}

export default cleanUpPirates;
