/// <reference path="../../data/templates/personalitytemplates.ts" />

/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>

/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>
/// <reference path="frontsai.ts"/>

module Rance
{
  export class EconomicAI
  {
    objectivesAI: ObjectivesAI;
    frontsAI: FrontsAI;

    mapEvaluator: MapEvaluator;
    player: Player;

    personality: IPersonalityData;

    constructor(props:
    {
      objectivesAI: ObjectivesAI;
      frontsAI: FrontsAI;

      mapEvaluator: MapEvaluator;
      personality: IPersonalityData;
    })
    {
      this.objectivesAI = props.objectivesAI;
      this.frontsAI = props.frontsAI;

      this.mapEvaluator = props.mapEvaluator;
      this.player = props.mapEvaluator.player;


      this.personality = props.personality;
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
        frontArchetypes, this.personality.unitCompositionPreference);

      for (var archetype in globalScores)
      {
        scores[archetype] = globalScores[archetype] * globalPreferenceWeight;
        scores[archetype] += frontScores[archetype];
      }

    }

    satisfyFrontRequest(front: Front, request: any)
    {
      
    }
  }
}
