/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Objectives
      {
        export var discovery: Rance.Templates.IObjectiveTemplate =
        {
          key: "discovery",
          movePriority: 999,
          preferredUnitComposition:
          {
            scouting: 1
          },
          moveRoutineFN: AIUtils.moveToRoutine,
          unitDesireFN: function(front: MapAI.Front)
          {
            if (front.units.length < 1) return 1;
            else return 0;
          },
          unitFitFN: function(unit: Unit, front: MapAI.Front)
          {
            var baseScore = 0;
            // ++ stealth
            var isStealthy = unit.isStealthy();
            if (isStealthy) baseScore += 0.2;
            // ++ vision
            var visionRange = unit.getVisionRange();
            if (visionRange <= 0)
            {
              return -1;
            }
            else
            {
              baseScore += Math.pow(visionRange, 1.5) / 2;
            }

            // -- strength
            var strength = unit.getStrengthEvaluation();
            baseScore -= strength / 1000;
            // -- cost
            var cost = unit.getTotalCost();
            baseScore -= cost / 1000;

            var score = baseScore * AIUtils.defaultUnitFitFN(unit, front, -1, 0, 1);

            return clamp(score, 0, 1);
          },
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator)
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

            var template = Rance.Modules.DefaultModule.Objectives.discovery;

            return AIUtils.makeObjectivesFromScores(template, scores, 0.5);
          },
          unitsToFillObjectiveFN: function(objective: MapAI.Objective)
          {
            return {min: 1, ideal: 1};
          }
        }
      }
    }
  }
}
