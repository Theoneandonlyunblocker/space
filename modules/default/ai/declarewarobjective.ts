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
        export var declareWar: Rance.Templates.IObjectiveTemplate =
        {
          key: "declareWar",
          creatorFunction: function(grandStrategyAI: MapAI.GrandStrategyAI,
            mapEvaluator: MapAI.MapEvaluator)
          {
            var template = Rance.Modules.DefaultModule.Objectives.declareWar;
            var basePriority = grandStrategyAI.desireForWar;

            var scores:
            {
              player: Player;
              score: number;
            }[] = [];

            for (var playerId in mapEvaluator.player.diplomacyStatus.metPlayers)
            {
              var player = mapEvaluator.player.diplomacyStatus.metPlayers[playerId];
              var score: number = -1;
              if (mapEvaluator.player.diplomacyStatus.canDeclareWarOn(player))
              {
                score = mapEvaluator.getDesireToGoToWarWith(player) * mapEvaluator.getAbilityToGoToWarWith(player);
              }

              console.log(mapEvaluator.player.diplomacyStatus.canDeclareWarOn(player), mapEvaluator.player.id, player.id, score);
              scores.push(
              {
                player: player,
                score: score
              });
            }

            return AIUtils.makeObjectivesFromScores(template, scores, basePriority);
          },
          diplomacyRoutineFN: function(objective: MapAI.Objective, diplomacyAI: MapAI.DiplomacyAI,
            adjustments: IRoutineAdjustmentByTargetId, afterDoneCallback: () => void)
          {
            diplomacyAI.diplomacyStatus.declareWarOn(objective.targetPlayer);
            afterDoneCallback();
          }
        }
      }
    }
  }
}
