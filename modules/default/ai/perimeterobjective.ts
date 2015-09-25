/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Objectives
      {
        export var perimeter: Rance.Templates.IObjectiveTemplate =
        {
          key: "perimeter",
          movePriority: 7,
          preferredUnitComposition:
          {
            scouting: 1
          },
          moveRoutineFN: AIUtils.moveToRoutine,
          unitDesireFN: AIUtils.scoutingUnitDesireFN,
          unitFitFN: AIUtils.scoutingUnitFitFN,
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator)
          {
            var playersToEstablishPerimeterAgainst: Player[] = [];
            var diplomacyStatus = mapEvaluator.player.diplomacyStatus;
            var statusByPlayer = diplomacyStatus.statusByPlayer;
            for (var playerId in statusByPlayer)
            {
              if (statusByPlayer[playerId] >= DiplomaticState.war)
              {
                playersToEstablishPerimeterAgainst.push(diplomacyStatus.metPlayers[playerId]);
              }
            }

            var allScoresByStar: AIUtils.IScoresByStar = {};
            for (var i = 0; i < playersToEstablishPerimeterAgainst.length; i++)
            {
              var player = playersToEstablishPerimeterAgainst[i];
              var scores = mapEvaluator.getScoredPerimeterLocationsAgainstPlayer(player, 1);

              AIUtils.mergeScoresByStar(allScoresByStar, scores);
            }

            var allScores:
            {
              star: Star;
              score: number;
            }[] = [];
            for (var starId in allScoresByStar)
            {
              if (allScoresByStar[starId].score > 0.04)
              {
                allScores.push(allScoresByStar[starId]);
              }
            }

            var template = Rance.Modules.DefaultModule.Objectives.perimeter;
            var objectives: MapAI.Objective[] = AIUtils.makeObjectivesFromScores(template, allScores, 0.5);


            return objectives;
          },
          unitsToFillObjectiveFN: function(objective: MapAI.Objective)
          {
            return {min: 1, ideal: 1};
          }
        }
      }
    }
  }
}
