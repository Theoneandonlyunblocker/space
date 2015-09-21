/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>
/// <reference path="mapevaluator.ts"/>
/// <reference path="grandstrategyai.ts" />
/// <reference path="objective.ts"/>

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

module Rance
{
  export module MapAI
  {
    export class ObjectivesAI
    {
      mapEvaluator: MapEvaluator;
      map: GalaxyMap;
      player: Player;
      grandStrategyAI: GrandStrategyAI;

      objectivesByType =
      {
        expansion: <Objective[]> [],
        cleanPirates: <Objective[]> [],
        heal: <Objective[]> [],
        discovery: <Objective[]> []
      };
      objectives: Objective[] = [];

      requests: any[] = [];

      constructor(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI)
      {
        this.mapEvaluator = mapEvaluator;
        this.map = mapEvaluator.map;
        this.player = mapEvaluator.player;
        this.grandStrategyAI = grandStrategyAI;
      }

      setAllObjectives()
      {
        this.objectives = [];

        this.addObjectives(this.getExpansionObjectives());
        this.addObjectives(this.getCleanPiratesObjectives());
        this.addObjectives(this.getHealObjectives());
        this.addObjectives(this.getDiscoveryObjectives());
      }

      addObjectives(objectives: Objective[])
      {
        this.objectives = this.objectives.concat(objectives);
      }

      getObjectivesByTarget(objectiveType: string, markAsOngoing: boolean)
      {
        var objectivesByTarget:
        {
          [starId: number]: Objective;
        } = {};

        for (var i = 0; i < this.objectivesByType[objectiveType].length; i++)
        {
          var objective = this.objectivesByType[objectiveType][i];
          if (markAsOngoing) objective.isOngoing = true;
          objectivesByTarget[objective.target.id] = objective;
        }

        return objectivesByTarget;
      }

      // base method used for getting expansion & cleanPirates objectives
      getIndependentFightingObjectives(objectiveType: string, evaluationScores: any, basePriority: number)
      {
        var objectivesByTarget = this.getObjectivesByTarget(objectiveType, true);
        var allObjectives: Objective[] = [];

        this.objectivesByType[objectiveType] = [];

        var minScore: number, maxScore: number;

        for (var i = 0; i < evaluationScores.length; i++)
        {
          var score = evaluationScores[i].score;
          //minScore = isFinite(minScore) ? Math.min(minScore, score) : score;
          maxScore = isFinite(maxScore) ? Math.max(maxScore, score) : score;
        }

        for (var i = 0; i < evaluationScores.length; i++)
        {
          var star = evaluationScores[i].star;
          var relativeScore = getRelativeValue(evaluationScores[i].score, 0, maxScore);
          var priority = relativeScore * basePriority;

          if (objectivesByTarget[star.id])
          {
            objectivesByTarget[star.id].priority = priority;
          }
          else
          {
            objectivesByTarget[star.id] = new Objective(objectiveType, priority, star);
          }

          allObjectives.push(objectivesByTarget[star.id]);
          this.objectivesByType[objectiveType].push(objectivesByTarget[star.id]);
        }

        return allObjectives;
      }

      getExpansionObjectives()
      {
        var evaluationScores = this.mapEvaluator.getScoredExpansionTargets();
        var basePriority = this.grandStrategyAI.desireForExpansion;
        return this.getIndependentFightingObjectives("expansion", evaluationScores, basePriority);
      }
      getCleanPiratesObjectives()
      {
        var evaluationScores = this.mapEvaluator.getScoredCleanPiratesTargets();
        var basePriority = this.grandStrategyAI.desireForConsolidation;
        return this.getIndependentFightingObjectives("cleanPirates", evaluationScores, basePriority);
      }
      getDiscoveryObjectives()
      {
        var discoveryScores = this.mapEvaluator.getScoredDiscoveryTargets();
        var basePriority = 0.6;
        return this.getIndependentFightingObjectives("discovery", discoveryScores, basePriority);
      }

      getHealObjectives()
      {
        var objective = new Objective("heal", 1, null);
        this.objectivesByType["heal"] = [objective];

        return [objective];
      }
    }
  }
}
