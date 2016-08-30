import DiplomacyAI from "../mapai/DiplomacyAI";
import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import Objective from "../mapai/Objective";

import ObjectiveTemplate from "./common/ObjectiveTemplate";
import RoutineAdjustmentByID from "../RoutineAdjustmentByID";

import Player from "../../../src/Player";

import
{
  makeObjectivesFromScores
} from "../aiUtils";

const declareWar: ObjectiveTemplate =
{
  key: "declareWar",
  creatorFunction: function(grandStrategyAI: GrandStrategyAI,
    mapEvaluator: MapEvaluator)
  {
    var template = declareWar;
    var basePriority = grandStrategyAI.desireForWar;

    var scores:
    {
      player: Player;
      score: number;
    }[] = [];

    for (let playerId in mapEvaluator.player.diplomacyStatus.metPlayers)
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

    return makeObjectivesFromScores(template, scores, basePriority);
  },
  diplomacyRoutineFN: function(objective: Objective, diplomacyAI: DiplomacyAI,
    adjustments: RoutineAdjustmentByID, afterDoneCallback: () => void)
  {
    diplomacyAI.diplomacyStatus.declareWarOn(objective.targetPlayer);
    afterDoneCallback();
  }
}

export default declareWar;
