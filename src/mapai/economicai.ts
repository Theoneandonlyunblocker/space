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

    

    satisfyFrontRequest(front: Front)
    {
      // TODO
      var star = this.player.getNearestOwnedStarTo(front.musterLocation);

      var archetypeScores = this.frontsAI.getFrontUnitArchetypeScores(front);
      var sortedScores = getObjectKeysSortedByValue(archetypeScores, "desc");

      var buildableUnitTypesByArchetype:
      {
        [archetype: string]: Templates.IUnitTemplate[];
      } = {};

      var buildableUnitTypes = star.getBuildableShipTypes();

      for (var i = 0; i < buildableUnitTypes.length; i++)
      {
        var archetype = buildableUnitTypes[i].archetype;

        if (!buildableUnitTypesByArchetype[archetype])
        {
          buildableUnitTypesByArchetype[archetype] = [];
        }

        buildableUnitTypesByArchetype[archetype].push(buildableUnitTypes[i]);
      }

      var unitType;

      for (var i = 0; i < sortedScores.length; i++)
      {
        if (buildableUnitTypesByArchetype[sortedScores[i]])
        {
          unitType = getRandomArrayItem(buildableUnitTypesByArchetype[sortedScores[i]]);
          break;
        }
      }
      if (!unitType) debugger;

      debugger;
    }
  }
}
