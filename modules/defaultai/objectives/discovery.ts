import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import Objective from "../mapai/Objective";

import ObjectiveTemplate from "./common/ObjectiveTemplate";

import Star from "../../../src/Star";
import
{
  getRelativeValue
} from "../../../src/utility";


import movePriority from "./common/movePriority";
import moveTo from "./common/moveroutines/moveTo";

import
{
  makeObjectivesFromScores,
  scoutingUnitDesireFN,
  scoutingUnitFitFN
} from "../aiUtils";


const discovery: ObjectiveTemplate =
{
  key: "discovery",
  movePriority: movePriority.discovery,
  preferredUnitComposition:
  {
    scouting: 1
  },
  moveRoutineFN: moveTo,
  unitDesireFN: scoutingUnitDesireFN,
  unitFitFN: scoutingUnitFitFN,
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var scores:
    {
      star: Star;
      score: number;
    }[] = [];
    var starsWithDistance:
    {
      [starId: number]: number;
    } = {};

    var linksToUnrevealedStars = mapEvaluator.player.getLinksToUnRevealedStars();

    var minDistance: number;
    var maxDistance: number;

    for (let starId in linksToUnrevealedStars)
    {
      var star = mapEvaluator.player.revealedStars[starId];
      var nearest = mapEvaluator.player.getNearestOwnedStarTo(star);
      var distance = star.getDistanceToStar(nearest);
      starsWithDistance[starId] = distance;

      if (!isFinite(minDistance))
      {
        minDistance = distance;
      }
      else
      {
        minDistance = Math.min(minDistance, distance);
      }
      if (!isFinite(maxDistance))
      {
        maxDistance = distance;
      }
      else
      {
        maxDistance = Math.max(maxDistance, distance);
      }
    }

    for (let starId in linksToUnrevealedStars)
    {
      var star = mapEvaluator.player.revealedStars[starId];
      var score = 0;

      var relativeDistance = getRelativeValue(starsWithDistance[starId], minDistance, maxDistance, true);
      var distanceMultiplier = 0.3 + 0.7 * relativeDistance;

      var linksScore = linksToUnrevealedStars[starId].length * 20;
      score += linksScore;

      var desirabilityScore = mapEvaluator.evaluateIndividualStarDesirability(star);
      desirabilityScore *= distanceMultiplier;
      score += desirabilityScore;

      score *= distanceMultiplier;

      scores.push(
      {
        star: star,
        score: score
      });
    }

    var template = discovery

    return makeObjectivesFromScores(template, scores, 0.5);
  },
  unitsToFillObjectiveFN: function(mapEvaluator: MapEvaluator, objective: Objective)
  {
    return {min: 1, ideal: 1};
  }
}

export default discovery;
