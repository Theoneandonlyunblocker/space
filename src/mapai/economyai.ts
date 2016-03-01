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
      resolveEconomicObjectives()
      {
        var objectives = this.objectivesAI.getObjectivesWithTemplateProperty("economyRoutineFN");
        var adjustments = this.objectivesAI.getAdjustmentsForTemplateProperty("economyRoutineAdjustments");

        for (var i = 0; i < objectives.length; i++)
        {
          var objective = objectives[i];
          objective.template.economyRoutineFN(objective, this, adjustments);
        }
      }
      satisfyAllRequests()
      {
        /*
        get all requests from OAI and FAI
        sort by priority
        fulfill by priority
         */
        var allRequests: Front[] = this.frontsAI.frontsRequestingUnits;
        allRequests.sort(function(a, b)
        {
          return b.objective.priority - a.objective.priority;
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
            // TODO ai | handle other requests
          }
        }
      }

      satisfyFrontRequest(front: Front)
      {
        var player = this.player;
        var starQualifierFN = function(star: Star)
        {
          return star.owner === player && star.manufactory && !star.manufactory.queueIsFull();
        }
        var star = front.musterLocation.getNearestStarForQualifier(starQualifierFN);
        var manufactory = star.manufactory;

        var archetypeScores = front.getNewUnitArchetypeScores();

        var buildableUnitTypesByArchetype:
        {
          [archetypeType: string]: Templates.IUnitTemplate[];
        } = {};

        var buildableUnitTypes = player.getGloballyBuildableUnits().concat(
          manufactory.getLocalUnitTypes().manufacturable);

        for (var i = 0; i < buildableUnitTypes.length; i++)
        {
          var archetype = buildableUnitTypes[i].archetype;

          if (!buildableUnitTypesByArchetype[archetype.type])
          {
            buildableUnitTypesByArchetype[archetype.type] = [];
          }
          if (!archetypeScores[archetype.type])
          {
            archetypeScores[archetype.type] = 0;
          }

          buildableUnitTypesByArchetype[archetype.type].push(buildableUnitTypes[i]);
        }

        var sortedScores = getObjectKeysSortedByValue(archetypeScores, "desc");
        var unitType: Templates.IUnitTemplate;

        for (var i = 0; i < sortedScores.length; i++)
        {
          if (buildableUnitTypesByArchetype[sortedScores[i]])
          {
            // TODO ai | should actually try to figure out which unit type to build
            unitType = getRandomArrayItem(buildableUnitTypesByArchetype[sortedScores[i]]);
            if (this.player.money < unitType.buildCost)
            {
              return;
            }
            else
            {
              break;
            }
          }
        }
        if (!unitType) debugger;

        manufactory.addThingToQueue(unitType, "unit");
      }
    }
  }
}
