/// <reference path="../../../src/templateinterfaces/iobjectivetemplate.d.ts" />

/// <reference path="aiutils.ts" />

export var declareWar: ObjectiveTemplate =
{
  key: "declareWar",
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var template = Modules.DefaultModule.Objectives.declareWar;
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
  diplomacyRoutineFN: function(objective: Objective, diplomacyAI: DiplomacyAI,
    adjustments: IRoutineAdjustmentByTargetId, afterDoneCallback: () => void)
  {
    diplomacyAI.diplomacyStatus.declareWarOn(objective.targetPlayer);
    afterDoneCallback();
  }
}
