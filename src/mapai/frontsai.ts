/// <reference path="../../data/templates/personalitytemplates.ts" />

/// <reference path="../player.ts"/>
/// <reference path="../galaxymap.ts"/>
/// <reference path="objectivesai.ts"/>
/// <reference path="front.ts"/>
/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>

module Rance
{
  export class FrontsAI
  {
    player: Player;
    map: GalaxyMap;
    mapEvaluator: MapEvaluator;
    objectivesAI: ObjectivesAI;
    personality: IPersonalityData;

    fronts: Front[] = [];
    frontsRequestingUnits: Front[] = [];
    frontsToMove: Front[] = [];

    constructor(mapEvaluator: MapEvaluator, objectivesAI: ObjectivesAI,
      personality: IPersonalityData)
    {
      this.mapEvaluator = mapEvaluator;
      this.map = mapEvaluator.map;
      this.player = mapEvaluator.player;
      this.objectivesAI = objectivesAI;
      this.personality = personality;
    }

    getTotalUnitCountByArchetype()
    {
      var totalUnitCountByArchetype = {};

      var units = this.player.getAllUnits();
      for (var i = 0; i < units.length; i++)
      {
        var unitArchetype = units[i].template.archetype;

        if (!totalUnitCountByArchetype[unitArchetype])
        {
          totalUnitCountByArchetype[unitArchetype] = 0;
        }

        totalUnitCountByArchetype[unitArchetype]++;
      }

      return totalUnitCountByArchetype;
    }

    getUnitArchetypeRelativeWeights(unitsByArchetype)
    {
      var min = 0;
      var max;
      for (var archetype in unitsByArchetype)
      {
        var count = unitsByArchetype[archetype];
        max = isFinite(max) ? Math.max(max, count) : count;
      }

      var relativeWeights:
      {
        [archetype: string]: number;
      } = {};

      for (var archetype in unitsByArchetype)
      {
        var count = unitsByArchetype[archetype];
        relativeWeights[archetype] = getRelativeValue(count, min, max);
      }

      return relativeWeights;
    }

    getUnitCompositionDeviationFromIdeal(idealWeights, unitsByArchetype)
    {
      var relativeWeights = this.getUnitArchetypeRelativeWeights(unitsByArchetype);

      var deviationFromIdeal:
      {
        [archetype: string]: number
      } = {};

      for (var archetype in idealWeights)
      {
        var ideal = idealWeights[archetype];
        var actual = relativeWeights[archetype] || 0;

        deviationFromIdeal[archetype] = ideal - actual;
      }

      return deviationFromIdeal;
    }

    getGlobalUnitArcheypeScores()
    {
      var ideal = this.personality.unitCompositionPreference;
      var actual = this.getTotalUnitCountByArchetype();
      return this.getUnitCompositionDeviationFromIdeal(ideal, actual);
    }

    getFrontUnitArchetypeScores(front: Front)
    {
      var relativeFrontSize =
        front.units.length / Object.keys(this.player.units).length;
      var globalPreferenceWeight = relativeFrontSize;

      var globalScores = this.getGlobalUnitArcheypeScores();

      var scores:
      {
        [archetype: string]: number;
      } = {};

      var frontArchetypes = front.getUnitCountByArchetype();
      var frontScores = this.getUnitCompositionDeviationFromIdeal(
        this.personality.unitCompositionPreference, frontArchetypes);

      for (var archetype in globalScores)
      {
        scores[archetype] = globalScores[archetype] * globalPreferenceWeight;
        scores[archetype] += frontScores[archetype];
        scores[archetype] /= 2;
      }

      return scores;
    }

    scoreUnitFitForFront(unit: Unit, front: Front, frontArchetypeScores)
    {

      // base score based on unit composition
      var score = frontArchetypeScores[unit.template.archetype];

      // add score based on front priority
      // lower priority if front requirements already met
      // more important fronts get priority but dont hog units
      var unitsOverMinimum = front.units.length - front.minUnitsDesired;
      var unitsOverIdeal = front.units.length - front.idealUnitsDesired;

      var priorityMultiplier = 1;
      if (unitsOverMinimum > 0)
      {
        priorityMultiplier -= unitsOverMinimum * 0.05;
      }
      if (unitsOverIdeal > 0)
      {
        priorityMultiplier -= unitsOverIdeal * 0.3;
      }

      var adjustedPriority = front.priority * priorityMultiplier;
      score += adjustedPriority * 2;

      // penalize initial units for front
      // inertia at beginning of adding units to front
      // so ai prioritizes fully formed fronts to incomplete ones
      var newUnitInertia = 0.5 - front.units.length * 0.1;
      if (newUnitInertia > 0)
      {
        score -= newUnitInertia;
      }

      // prefer units already part of this front
      var alreadyInFront = unit.front && unit.front === front;
      if (alreadyInFront)
      {
        score += 0.3;
        if (front.hasMustered)
        {
          score += 0.3;
        }
      }

      // penalize fronts with high requirements
      // reduce forming incomplete fronts even if they have high priority
      // effect lessens as total unit count increases

      // TODO

      // prioritize units closer to front target
      var distance = unit.fleet.location.getDistanceToStar(front.targetLocation);
      var distanceAdjust = distance * -0.1;
      score += distanceAdjust;
 
      return score;
    }

    getUnitScoresForFront(units: Unit[], front: Front)
    {
      var scores:
      {
        unit: Unit;
        score: number;
        front: Front;
      }[] = [];

      var frontArchetypeScores = this.getFrontUnitArchetypeScores(front);

      for (var i = 0; i < units.length; i++)
      {
        scores.push(
        {
          unit: units[i],
          score: this.scoreUnitFitForFront(units[i], front, frontArchetypeScores),
          front: front
        });
      }

      return scores;
    }

    assignUnits()
    {
      var units = this.player.getAllUnits();

      var allUnitScores = [];
      var unitScoresByFront:
      {
        [frontId: number]: any[];
      } = {};

      var recalculateScoresForFront = function(front: Front)
      {
        var archetypeScores = this.getFrontUnitArchetypeScores(front);
        var frontScores = unitScoresByFront[front.id];

        for (var i = 0; i < frontScores.length; i++)
        {
          var unit = frontScores[i].unit;
          frontScores[i].score = this.scoreUnitFitForFront(unit, front, archetypeScores);
        }
      }.bind(this);

      var removeUnit = function(unit: Unit)
      {
        for (var frontId in unitScoresByFront)
        {
          unitScoresByFront[frontId] = unitScoresByFront[frontId].filter(function(score)
          {
            return score.unit !== unit;
          });
        }
      }

      // ascending
      var sortByScoreFN = function(a, b)
      {
        return a.score - b.score;
      }

      for (var i = 0; i < this.fronts.length; i++)
      {
        var frontScores = this.getUnitScoresForFront(units, this.fronts[i]);
        unitScoresByFront[this.fronts[i].id] = frontScores;
        allUnitScores = allUnitScores.concat(frontScores);
      }

      var alreadyAdded:
      {
        [unitId: number]: boolean;
      } = {};


      while (allUnitScores.length > 0)
      {
        // sorted in loop as scores get recalculated every iteration
        allUnitScores.sort(sortByScoreFN);

        var bestScore = allUnitScores.pop();
        if (alreadyAdded[bestScore.unit.id])
        {
          continue;
        }

        bestScore.front.addUnit(bestScore.unit);

        removeUnit(bestScore.unit);
        alreadyAdded[bestScore.unit.id] = true;
        recalculateScoresForFront(bestScore.front);
      }
    }

    getFrontWithId(id: number)
    {
      for (var i = 0; i < this.fronts.length; i++)
      {
        if (this.fronts[i].id === id)
        {
          return this.fronts[i];
        }
      }

      return null;
    }

    createFront(objective: Objective)
    {
      var musterLocation = this.player.getNearestOwnedStarTo(
        objective.target);
      var unitsDesired = this.getUnitsToFillExpansionObjective(objective);

      var front = new Front(
      {
        id: objective.id,
        priority: objective.priority,
        objective: objective,

        minUnitsDesired: unitsDesired,
        idealUnitsDesired: unitsDesired,

        targetLocation: objective.target,
        musterLocation: musterLocation
      });

      return front;
    }

    removeInactiveFronts()
    {
      // loop backwards because splicing
      for (var i = this.fronts.length - 1; i >= 0; i--)
      {
        var front = this.fronts[i];
        var hasActiveObjective = false;

        for (var j = 0; j < this.objectivesAI.objectives.length; j++)
        {
          var objective = this.objectivesAI.objectives[j];
          if (objective.id === front.id && objective.priority > 0.4)
          {
            hasActiveObjective = true;
            break;
          }
        }

        if (!hasActiveObjective)
        {
          this.fronts.splice(i, 1);
        }
      }
    }

    formFronts()
    {
      /*
      dissolve old fronts without an active objective
      create new fronts for every objective not already assoicated with one
       */
      this.removeInactiveFronts();

      for (var i = 0; i < this.objectivesAI.objectives.length; i++)
      {
        var objective = this.objectivesAI.objectives[i];

        if (objective.priority > 0.4)
        {
          if (!this.getFrontWithId(objective.id))
          {
            var front = this.createFront(objective);
            this.fronts.push(front);
          }
        }
      }
    }

    organizeFleets()
    {
      for (var i = 0; i < this.fronts.length; i++)
      {
        this.fronts[i].organizeFleets();
      }
    }

    setFrontsToMove()
    {
      this.frontsToMove = this.fronts.slice(0);
    }

    moveFleets(afterMovingAllCallback: any)
    {
      var front = this.frontsToMove.pop();

      if (!front)
      {
        afterMovingAllCallback();
        return;
      }

      front.moveFleets(this.moveFleets.bind(this, afterMovingAllCallback));
    }

    getUnitsToFillExpansionObjective(objective: Objective)
    {
      var star = objective.target;
      var independentShips = star.getAllShipsOfPlayer(star.owner);

      if (independentShips.length === 1) return 2;
      else
      {
        var desired = independentShips.length + 2;
        return Math.min(desired, 6);
      }
    }

    setUnitRequests()
    {
      /*for each front that doesnt fulfill minimum unit requirement
        make request with same priority of front
      */
     
      this.frontsRequestingUnits = [];

      for (var i = 0; i < this.fronts.length; i++)
      {
        var front = this.fronts[i];
        if (front.units.length < front.idealUnitsDesired)
        {
          this.frontsRequestingUnits.push(front);
        }
      }
    }
  }
}
