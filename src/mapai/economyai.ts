/// <reference path="../../modules/default/templates/personalities.ts" />

/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>

/// <reference path="mapevaluator.ts"/>
/// <reference path="objectivesai.ts"/>
/// <reference path="frontsai.ts"/>

module Rance
{
  export module MapAI
  {
    export class EconomyAI
    {
      objectivesAI: ObjectivesAI;
      frontsAI: FrontsAI;

      mapEvaluator: MapEvaluator;
      player: Player;

      personality: IPersonality;

      constructor(props:
      {
        objectivesAI: ObjectivesAI;
        frontsAI: FrontsAI;

        mapEvaluator: MapEvaluator;
        personality: IPersonality;
      })
      {
        this.objectivesAI = props.objectivesAI;
        this.frontsAI = props.frontsAI;

        this.mapEvaluator = props.mapEvaluator;
        this.player = props.mapEvaluator.player;

        this.personality = props.personality;
      }

      satisfyAllRequests()
      {
        /*
        get all requests from OAI and FAI
        sort by priority
        fulfill by priority
         */
        var allRequests = this.objectivesAI.requests.concat(this.frontsAI.frontsRequestingUnits);
        allRequests.sort(function(a, b)
        {
          return b.priority - a.priority;
        });

        for (var i = 0; i < allRequests.length; i++)
        {
          var request = allRequests[i];
          // is front
          if (request.targetLocation)
          {
            this.satisfyFrontRequest(request);
          }
          else
          {
            
          }
        }
      }

      satisfyFrontRequest(front: Front)
      {
        // TODO
        var star = this.player.getNearestOwnedStarTo(front.musterLocation);

        var archetypeScores = this.frontsAI.getFrontUnitArchetypeScores(front);
        var sortedScores = getObjectKeysSortedByValue(archetypeScores, "desc");

        var buildableUnitTypesByArchetype:
        {
          [archetypeType: string]: Templates.IUnitTemplate[];
        } = {};

        var buildableUnitTypes = star.getBuildableShipTypes();

        for (var i = 0; i < buildableUnitTypes.length; i++)
        {
          var archetype = buildableUnitTypes[i].archetype;

          if (!buildableUnitTypesByArchetype[archetype.type])
          {
            buildableUnitTypesByArchetype[archetype.type] = [];
          }

          buildableUnitTypesByArchetype[archetype.type].push(buildableUnitTypes[i]);
        }

        var unitType: Templates.IUnitTemplate;

        for (var i = 0; i < sortedScores.length; i++)
        {
          if (buildableUnitTypesByArchetype[sortedScores[i]])
          {
            unitType = getRandomArrayItem(buildableUnitTypesByArchetype[sortedScores[i]]);
            if (this.player.money < unitType.buildCost)
            {
              // TODO AI should actually try to figure out which individual unit would
              // be the best
              return;
            }
            else
            {
              break;
            }
          }
        }
        if (!unitType) debugger;

        var unit = this.player.buildUnit(unitType, star);
        
        front.addUnit(unit);
      }
    }
  }
}
