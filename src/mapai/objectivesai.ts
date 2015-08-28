/// <reference path="../galaxymap.ts"/>
/// <reference path="../game.ts"/>
/// <reference path="mapevaluator.ts"/>
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

module Rance
{
  export class ObjectivesAI
  {
    mapEvaluator: MapEvaluator;
    map: GalaxyMap;
    player: Player;
    game: Game;

    objectivesByType =
    {
      expansion: [],
      cleanPirates: [],
      heal: []
    };
    objectives: Objective[] = [];

    maxActiveExpansionRequests: number;

    requests: any[] = [];

    constructor(mapEvaluator: MapEvaluator, game: Game)
    {
      this.mapEvaluator = mapEvaluator;
      this.map = mapEvaluator.map;
      this.player = mapEvaluator.player;
      this.game = game;
    }

    setAllObjectives()
    {
      this.objectives = [];

      this.addObjectives(this.getExpansionObjectives());
      this.addObjectives(this.getCleanPiratesObjectives());
      this.addObjectives(this.getHealObjectives());
    }

    addObjectives(objectives: Objective[])
    {
      this.objectives = this.objectives.concat(objectives);
    }

    // base method used for getting expansion & cleanPirates objectives
    getIndependentFightingObjectives(objectiveType: string, evaluationScores: any, basePriority: number)
    {
      var objectivesByTarget:
      {
        [starId: number]: Objective;
      } = {};

      var allObjectives: Objective[] = [];

      for (var i = 0; i < this.objectivesByType[objectiveType].length; i++)
      {
        var objective = this.objectivesByType[objectiveType][i];
        objective.isOngoing = true;
        objectivesByTarget[objective.target.id] = objective;
      }

      this.objectivesByType[objectiveType] = [];


      var minScore, maxScore;

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
          objectivesByTarget[star.id] = new Objective(objectiveType, priority, star, evaluationScores[i]);
        }

        allObjectives.push(objectivesByTarget[star.id]);
        this.objectivesByType[objectiveType].push(objectivesByTarget[star.id]);
      }

      return allObjectives;
    }

    getExpansionObjectives()
    {
      var evaluationScores = this.mapEvaluator.getScoredExpansionTargets();
      return this.getIndependentFightingObjectives("expansion", evaluationScores, 1);
    }
    getCleanPiratesObjectives()
    {
      var evaluationScores = this.mapEvaluator.getScoredCleanPiratesTargets();
      return this.getIndependentFightingObjectives("cleanPirates", evaluationScores, 0.2);
    }
    getHealObjectives()
    {
      var objective = new Objective("heal", 1, null);
      this.objectivesByType["heal"] = [objective];

      return [objective];
    }
  }
}
