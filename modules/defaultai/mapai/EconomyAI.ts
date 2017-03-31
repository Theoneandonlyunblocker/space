import {Front} from "./Front";
import FrontsAI from "./FrontsAI";
import MapEvaluator from "./MapEvaluator";
import {ObjectivesAI} from "./ObjectivesAI";

import Personality from "../../../src/Personality";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import
{
  getObjectKeysSortedByValue,
  getRandomArrayItem,
} from "../../../src/utility";

import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

export default class EconomyAI
{
  objectivesAI: ObjectivesAI;
  frontsAI: FrontsAI;

  mapEvaluator: MapEvaluator;
  player: Player;

  personality: Personality;

  constructor(props:
  {
    objectivesAI: ObjectivesAI;
    frontsAI: FrontsAI;

    mapEvaluator: MapEvaluator;
    personality: Personality;
  })
  {
    this.objectivesAI = props.objectivesAI;
    this.frontsAI = props.frontsAI;

    this.mapEvaluator = props.mapEvaluator;
    this.player = props.mapEvaluator.player;

    this.personality = props.personality;
  }
  // TODO 03.04.2017 | should have 1 method for all econ objectives. currently oai.processEconomicObjectives
  satisfyAllRequests()
  {
    /*
    get all requests from OAI and FAI
    sort by priority
    fulfill by priority
     */
    const allRequests: Front[] = this.frontsAI.frontsRequestingUnits;
    allRequests.sort((a, b) =>
    {
      return b.objective.priority - a.objective.priority;
    });
    for (let i = 0; i < allRequests.length; i++)
    {
      const request = allRequests[i];
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
    const player = this.player;
    const starQualifierFN = function(star: Star)
    {
      return star.owner === player && star.manufactory && !star.manufactory.queueIsFull();
    };
    const star = front.musterLocation.getNearestStarForQualifier(starQualifierFN);
    if (!star)
    {
      return;
    }
    const manufactory = star.manufactory;

    const archetypeScores = front.getNewUnitArchetypeScores();

    const buildableUnitTypesByArchetype:
    {
      [archetypeType: string]: UnitTemplate[];
    } = {};

    const globalBuildableUnitTypes = player.getGloballyBuildableUnits();
    const buildableUnitTypes = globalBuildableUnitTypes.concat(
      manufactory.getUniqueLocalUnitTypes(globalBuildableUnitTypes),
    );

    for (let i = 0; i < buildableUnitTypes.length; i++)
    {
      const archetype = buildableUnitTypes[i].archetype;

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

    const sortedScores = getObjectKeysSortedByValue(archetypeScores, "desc");
    let unitType: UnitTemplate;

    for (let i = 0; i < sortedScores.length; i++)
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
    if (!unitType)
    {
      throw new Error();
    }

    manufactory.addThingToQueue(unitType, "unit");
  }
}
