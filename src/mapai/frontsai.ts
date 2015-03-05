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
    requests: any[] = [];

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
      var score = frontArchetypeScores[unit.archetype];

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

      return scores();
    }

    assignUnits()
    {
      var units = this.player.units;
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
  }
}
