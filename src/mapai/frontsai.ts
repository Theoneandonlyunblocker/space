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
        priorityMultiplier -= unitsOverIdeal * 0.1;
      }

      var adjustedPriority = front.priority * priorityMultiplier;
      score += adjustedPriority;

      // penalize initial units for front
      // inertia at beginning of adding units to front
      // so ai prioritizes fully formed fronts to incomplete ones
      var newUnitInertia = 0.4 - front.units.length * 0.1;
      if (newUnitInertia > 0)
      {
        score -= newUnitInertia;
      }

      // penalize fronts with high requirements
      // reduce forming incomplete fronts even if they have high priority
      // effect lessens as total unit count increases

      // TODO

      // prioritize units closer to front target
      var distance = unit.fleet.location.getDistanceToStar(front.targetLocation);
      var distanceAdjust = distance * -0.05;
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
      }

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

      while (allUnitScores.length > 0)
      {
        allUnitScores.sort(sortByScoreFN);

        var bestScore = allUnitScores.pop();

        bestScore.front.addUnit(bestScore.unit);

        removeUnit(bestScore.unit);
        recalculateScoresForFront(bestScore.front);
      }
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
        this.frontsRequestingUnits.push(front);
      }
    }
  }
}
