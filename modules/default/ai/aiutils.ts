module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module AIUtils
      {
        export function moveToRoutine(front: MapAI.Front,
          afterMoveCallback: Function, getMoveTargetFN?: (fleet: Fleet) => Star)
        {
          var fleets = front.getAssociatedFleets();

          if (fleets.length <= 0)
          {
            afterMoveCallback();
            return;
          }

          var finishedMovingCount = 0;
          var finishFleetMoveFN = function()
          {
            finishedMovingCount++;
            if (finishedMovingCount >= fleets.length)
            {
              afterMoveCallback();
            }
          };

          for (var i = 0; i < fleets.length; i++)
          {
            var moveTarget: Star = getMoveTargetFN ? getMoveTargetFN(fleets[i]) : front.objective.target;
            fleets[i].pathFind(moveTarget, null, finishFleetMoveFN);
          }
        }
        export function musterAndAttackRoutine(front: MapAI.Front, afterMoveCallback: Function)
        {
          var shouldMoveToTarget: boolean;

          var unitsByLocation = front.getUnitsByLocation();
          var fleets = front.getAssociatedFleets();

          var atMuster = unitsByLocation[front.musterLocation.id] ? 
            unitsByLocation[front.musterLocation.id].length : 0;


          var inRangeOfTarget = 0;

          for (var i = 0; i < fleets.length; i++)
          {
            var distance = fleets[i].location.getDistanceToStar(front.targetLocation);
            if (fleets[i].getMinCurrentMovePoints() >= distance)
            {
              inRangeOfTarget += fleets[i].ships.length;
            }
          }


          if (front.hasMustered)
          {
            shouldMoveToTarget = true;
          }
          else
          {

            if (atMuster >= front.minUnitsDesired || inRangeOfTarget >= front.minUnitsDesired)
            {
              front.hasMustered = true;
              shouldMoveToTarget = true;
            }
            else
            {
              shouldMoveToTarget = false;
            }

          }

          var moveTarget = shouldMoveToTarget ? front.targetLocation : front.musterLocation;


          var finishAllMoveFN = function()
          {
            unitsByLocation = front.getUnitsByLocation();
            var atTarget = unitsByLocation[front.targetLocation.id] ? 
              unitsByLocation[front.targetLocation.id].length : 0;

            if (atTarget >= front.minUnitsDesired)
            {
              var star = front.targetLocation;
              var player = front.units[0].fleet.player;

              if (front.objective.type === "expansion" || front.objective.type === "cleanPirates")
              {
                var attackTargets = star.getTargetsForPlayer(player);

                var target = attackTargets.filter(function(target)
                {
                  return target.enemy.isIndependent;
                })[0];

                player.attackTarget(star, target, afterMoveCallback);
              }
            }
            else
            {
              afterMoveCallback();
            }
          }

          var finishedMovingCount = 0;
          var finishFleetMoveFN = function()
          {
            finishedMovingCount++;
            if (finishedMovingCount >= fleets.length)
            {
              finishAllMoveFN();
            }
          };

          for (var i = 0; i < fleets.length; i++)
          {
            fleets[i].pathFind(moveTarget, null, finishFleetMoveFN);
          }
        }
        export function defaultUnitDesireFN(front: MapAI.Front)
        {
          var desire = 1;

          // lower desire if front requirements already met
          // more important fronts get priority but dont hog units
          var unitsOverMinimum = front.units.length - front.minUnitsDesired;
          var unitsOverIdeal = front.units.length - front.idealUnitsDesired;
          var unitsUnderMinimum = front.minUnitsDesired - front.units.length;
          if (unitsOverMinimum > 0)
          {
            desire *= 0.85 / unitsOverMinimum;
          }
          if (unitsOverIdeal > 0)
          {
            desire *= 0.6 / unitsOverIdeal;
          }

          // penalize initial units for front
          // inertia at beginning of adding units to front
          // so ai prioritizes fully formed fronts to incomplete ones
          if (unitsUnderMinimum > 0)
          {
            var intertiaPerMissingUnit = 0.5 / front.minUnitsDesired;
            var newUnitInertia = intertiaPerMissingUnit * (unitsUnderMinimum - 1);
            desire *= 1 - newUnitInertia;
          }

          return desire;
        }
        export function defaultUnitFitFN(unit: Unit, front: MapAI.Front, lowHealthThreshhold: number = 0.75,
          healthAdjust: number = 1, distanceAdjust: number = 1)
        {
          var score = 1;

          // penalize units on low health
          var healthPercentage = unit.currentHealth / unit.maxHealth;
          
          if (healthPercentage < lowHealthThreshhold)
          {
            score *= 1 - healthPercentage * healthAdjust;
          }

          // prioritize units closer to front target
          var turnsToReach = unit.getTurnsToReachStar(front.targetLocation);
          if (turnsToReach > 0)
          {
            turnsToReach *= distanceAdjust;
            var distanceMultiplier = 1 / (Math.log(turnsToReach + 1.5) / Math.log(2));
            score *= distanceMultiplier;
          }

          return score;
        }
        export function makeObjectivesFromScores(template: Rance.Templates.IObjectiveTemplate,
          evaluationScores: {star: Star; score: number;}[], basePriority: number)
        {
          var allObjectives: MapAI.Objective[] = [];

          var minScore: number = 0;
          var maxScore: number;

          for (var i = 0; i < evaluationScores.length; i++)
          {
            var score = evaluationScores[i].score;
            maxScore = isFinite(maxScore) ? Math.max(maxScore, score) : score;
          }

          for (var i = 0; i < evaluationScores.length; i++)
          {
            var star = evaluationScores[i].star;
            var relativeScore = getRelativeValue(evaluationScores[i].score, minScore, maxScore);
            var priority = relativeScore * basePriority;

            allObjectives.push(new MapAI.Objective(template, priority, star));
          }

          return allObjectives;
        }
        export function getUnitsToFillIndependentObjective(objective: MapAI.Objective)
        {
          var min: number;
          var ideal: number;
          var star = objective.target;
          var independentShips = star.getIndependentShips();

          if (independentShips.length <= 1)
          {
            min = independentShips.length + 1;
            ideal = independentShips.length + 1;
          }
          else
          {
            min = Math.min(independentShips.length + 2, 6);
            ideal = 6;
          }

          return(
          {
            min: min,
            ideal: ideal
          });
        }
      }
    }
  }
}
