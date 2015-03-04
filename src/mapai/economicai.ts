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

    totalUnitCountByArchetype:
    {
      [unitArchetype: string]: number;
    } = {};

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

    resetTotalUnitCountByArchetype()
    {
      this.totalUnitCountByArchetype = {};

      var units = this.player.getAllUnits();
      for (var i = 0; i < units.length; i++)
      {
        var unitArchetype = units[i].template.archetype;

        if (!this.totalUnitCountByArchetype[unitArchetype])
        {
          this.totalUnitCountByArchetype[unitArchetype] = 0;
        }

        this.totalUnitCountByArchetype[unitArchetype]++;
      }
    }

    getTotalUnitArchetypeRelativeWeights()
    {
      var min = 0;
      var max;
      for (var archetype in this.totalUnitCountByArchetype)
      {
        var count = this.totalUnitCountByArchetype[archetype];
        max = isFinite(max) ? Math.max(max, count) : count;
      }

      var relativeWeights:
      {
        [archetype: string]: number;
      } = {};

      for (var archetype in this.totalUnitCountByArchetype)
      {
        var count = this.totalUnitCountByArchetype[archetype];
        relativeWeights[archetype] = getRelativeValue(count, min, max);
      }

      return relativeWeights;
    }

    getGlobalUnitArcheypeScores()
    {
      this.resetTotalUnitCountByArchetype();
      var relativeWeights = this.getTotalUnitArchetypeRelativeWeights();

      var deviationFromIdeal:
      {
        [archetype: string]: number
      } = {};

      var idealWeights = this.personality.unitCompositionPreference;

      for (var archetype in idealWeights)
      {
        var ideal = idealWeights[archetype];
        var actual = relativeWeights[archetype] || 0;

        deviationFromIdeal[archetype] = ideal - actual;
      }

      return deviationFromIdeal;
    }

    getFrontUnitArchetypePreference(front: Front)
    {

    }

    satisfyFrontRequest(front: Front, request: any)
    {
      
    }
  }
}
