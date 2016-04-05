/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

export var discovery: ObjectiveTemplate =
{
  key: "discovery",
  movePriority: 999,
  preferredUnitComposition:
  {
    scouting: 1
  },
  moveRoutineFN: AIUtils.moveToRoutine,
  unitDesireFN: AIUtils.scoutingUnitDesireFN,
  unitFitFN: AIUtils.scoutingUnitFitFN,
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

    for (var starId in linksToUnrevealedStars)
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

    for (var starId in linksToUnrevealedStars)
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

    var template = Modules.DefaultModule.Objectives.discovery;

    return AIUtils.makeObjectivesFromScores(template, scores, 0.5);
  },
  unitsToFillObjectiveFN: function(mapEvaluator: MapEvaluator, objective: Objective)
  {
    return {min: 1, ideal: 1};
  }
}
