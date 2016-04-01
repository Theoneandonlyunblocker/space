/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Objectives
      {
        export var declareWar: Rance.ObjectiveTemplate =
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
              if (!mapEvaluator.player.diplomacyStatus.canDeclareWarOn(player))
              {
                continue;
              }

              var score = mapEvaluator.getDesireToGoToWarWith(player) *
                mapEvaluator.getAbilityToGoToWarWith(player);

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
