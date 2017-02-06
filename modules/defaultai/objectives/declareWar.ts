import DiplomacyAI from "../mapai/DiplomacyAI";
import GrandStrategyAI from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";
import Objective from "../mapai/Objective";

import RoutineAdjustmentByID from "../RoutineAdjustmentByID";
import ObjectiveTemplate from "./common/ObjectiveTemplate";

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

    const neighborPlayers = mapEvaluator.player.getNeighboringPlayers();
    const metNeighborPlayers = neighborPlayers.filter(player =>
    {
      return Boolean(mapEvaluator.player.diplomacyStatus.metPlayers[player.id]);
    });

    metNeighborPlayers.forEach(targetPlayer =>
    {
      const canDeclareWar = mapEvaluator.player.diplomacyStatus.canDeclareWarOn(targetPlayer);
      if (canDeclareWar)
      {
        const score = mapEvaluator.getDesireToGoToWarWith(targetPlayer) *
          mapEvaluator.getAbilityToGoToWarWith(targetPlayer);

        console.log("make declare war objective " + mapEvaluator.player.id + "->" + targetPlayer.id);

        scores.push(
        {
          player: targetPlayer,
          score: score
        });
      }
    })

    return makeObjectivesFromScores(template, scores, basePriority);
  },
  diplomacyRoutineFN: function(objective: Objective, diplomacyAI: DiplomacyAI,
    adjustments: RoutineAdjustmentByID, afterDoneCallback: () => void)
  {
    console.log("declare war " + diplomacyAI.mapEvaluator.player.id + "->" + objective.targetPlayer.id);
    diplomacyAI.diplomacyStatus.declareWarOn(objective.targetPlayer);
    afterDoneCallback();
  }
}

export default declareWar;
