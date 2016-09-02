
import app from "../../../src/App"; // TODO global

import MapEvaluator from "./MapEvaluator";
import GrandStrategyAI from "./GrandStrategyAI";
import Objective from "./Objective";

import GalaxyMap from "../../../src/GalaxyMap";
import Player from "../../../src/Player";

import RoutineAdjustmentByID from "../RoutineAdjustmentByID";
import ObjectiveTemplate from "../objectives/common/ObjectiveTemplate";
import allObjectiveTemplates from "../Objectives";

/*
-- objectives ai
get expansion targets
create expansion objectives with priority based on score
add flat amount of priority if objective is ongoing
sort objectives by priority
while under max active expansion objectives
  make highest priority expansion objective active

-- fronts ai
divide available units to fronts based on priority
make requests for extra units if needed
muster units at muster location
when requested units arrive
  move units to target location
  execute action

-- economy ai
build units near request target
 */

/*
scouting objectives
  discovery
    find new locations
  tracking
    track enemy armies
  perimeter
    create perimeter of vision around own locations
 */

export default class ObjectivesAI
{
  mapEvaluator: MapEvaluator;
  map: GalaxyMap;
  player: Player;
  grandStrategyAI: GrandStrategyAI;

  objectivesByType:
  {
    [objectiveType: string]: Objective[];
  } = {};
  objectives: Objective[] = [];

  requests: any[] = [];

  constructor(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI)
  {
    this.mapEvaluator = mapEvaluator;
    this.map = mapEvaluator.map;
    this.player = mapEvaluator.player;
    this.grandStrategyAI = grandStrategyAI;
  }
  clearObjectives()
  {
    this.objectives = [];
  }
  setAllDiplomaticObjectives()
  {
    this.clearObjectives();
    this.setAllObjectivesWithTemplateProperty("diplomacyRoutineFN");
  }
  setAllEconomicObjectives()
  {
    this.clearObjectives();
    this.setAllObjectivesWithTemplateProperty("economyRoutineFN");
  }
  setAllMoveObjectives()
  {
    this.clearObjectives();
    this.setAllObjectivesWithTemplateProperty("moveRoutineFN");
  }
  setAllObjectivesWithTemplateProperty(propKey: string)
  {
    for (let key in allObjectiveTemplates)
    {
      var template = allObjectiveTemplates[key];
      if (template[propKey])
      {
        this.setObjectivesOfType(allObjectiveTemplates[key]);
      }
    }
  }
  getNewObjectivesOfType(objectiveTemplate: ObjectiveTemplate)
  {
    var objectiveType = objectiveTemplate.key;
    var byTarget = this.getObjectivesByTarget(objectiveType, true);
    var newObjectives = objectiveTemplate.creatorFunction(this.grandStrategyAI, this.mapEvaluator, this);
    var finalObjectives: Objective[] = [];

    for (let i = 0; i < newObjectives.length; i++)
    {
      var newObjective = newObjectives[i];
      if (newObjective.priority < 0.04)
      {
        continue;
      }
      var keyString = newObjective.target ? newObjective.target.id : "noTarget";
      var oldObjective = byTarget[keyString];
      if (oldObjective)
      {
        oldObjective.priority = newObjective.priority;
        finalObjectives.push(oldObjective);
      }
      else
      {
        finalObjectives.push(newObjective);
      }
    }

    return finalObjectives;
  }
  setObjectivesOfType(objectiveTemplate: ObjectiveTemplate)
  {
    var newObjectives = this.getNewObjectivesOfType(objectiveTemplate);
    this.objectivesByType[objectiveTemplate.key] = newObjectives;
    this.objectives = this.objectives.concat(newObjectives);
  }
  getObjectivesByTarget(objectiveType: string, markAsOngoing: boolean)
  {
    var objectivesByTarget:
    {
      [targetString: string]: Objective;
    } = {};

    if (!this.objectivesByType[objectiveType])
    {
      return objectivesByTarget;
    }

    for (let i = 0; i < this.objectivesByType[objectiveType].length; i++)
    {
      var objective = this.objectivesByType[objectiveType][i];
      if (markAsOngoing) objective.isOngoing = true;

      var keyString = objective.target ? objective.target.id : "noTarget";
      objectivesByTarget[keyString] = objective;
    }

    return objectivesByTarget;
  }
  getObjectivesWithTemplateProperty(propKey: string)
  {
    return this.objectives.filter(function(objective: Objective)
    {
      return Boolean(objective.template[propKey]);
    });
  }
  getAdjustmentsForTemplateProperty(propKey: string)
  {
    var withAdjustment = this.getObjectivesWithTemplateProperty(propKey);
    var adjustments: RoutineAdjustmentByID;

    for (let i = 0; i < withAdjustment.length; i++)
    {
      for (let j = 0; j < withAdjustment[i].template[propKey].length; j++)
      {
        var adjustment = withAdjustment[i].template[propKey][j];
        if (!adjustments[adjustment.target.id])
        {
          adjustments[adjustment.target.id] =
          {
            target: adjustment.target,
            multiplier: 1
          }
        }
        adjustments[adjustment.target.id].multiplier += adjustment.multiplier;
      }
    }

    return adjustments;
  }
}