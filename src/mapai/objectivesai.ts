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
      this.addObjectives(this.getHealObjectives());
    }

    addObjectives(objectives: Objective[])
    {
      this.objectives = this.objectives.concat(objectives);
    }

    getExpansionObjectives()
    {
      var objectivesByTarget:
      {
        [starId: number]: Objective;
      } = {};

      var allObjectives: Objective[] = [];

      for (var i = 0; i < this.objectivesByType.expansion.length; i++)
      {
        var _o = this.objectivesByType.expansion[i];
        _o.isOngoing = true;
        objectivesByTarget[_o.target.id] = _o;
      }

      this.objectivesByType["expansion"] = [];

      var minScore, maxScore;

      var expansionScores = this.mapEvaluator.getScoredExpansionTargets();

      for (var i = 0; i < expansionScores.length; i++)
      {
        var score = expansionScores[i].score;
        //minScore = isFinite(minScore) ? Math.min(minScore, score) : score;
        maxScore = isFinite(maxScore) ? Math.max(maxScore, score) : score;
      }

      for (var i = 0; i < expansionScores.length; i++)
      {
        var star = expansionScores[i].star;
        var relativeScore = getRelativeValue(expansionScores[i].score, 0, maxScore);
        if (objectivesByTarget[star.id])
        {
          objectivesByTarget[star.id].priority = relativeScore;
        }
        else
        {
          objectivesByTarget[star.id] = new Objective("expansion", relativeScore, star, expansionScores[i]);
        }

        allObjectives.push(objectivesByTarget[star.id]);
        this.objectivesByType["expansion"].push(objectivesByTarget[star.id]);
      }

      return allObjectives;
    }

    getHealObjectives()
    {
      var objective = new Objective("heal", 1, null);
      this.objectivesByType["heal"] = [objective];

      return [objective];
    }

    processExpansionObjectives(objectives: Objective[])
    {
      var activeObjectives: Objective[] = [];


    }
  }
}
