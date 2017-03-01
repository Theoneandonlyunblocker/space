import {DiplomaticObjective} from "./common/DiplomaticObjective";

import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import Player from "../../../src/Player";

export class DeclareWar extends DiplomaticObjective
{
  public readonly type = "DeclareWar";

  public readonly target: Player;

  protected constructor(score: number, target: Player)
  {
    super(score);
    this.target = target;
  }

  public static getObjectives(mapEvaluator: MapEvaluator, currentObjectives: DeclareWar[]): DeclareWar[]
  {
    const metNeighborPlayers = mapEvaluator.player.getNeighboringPlayers().filter(player =>
    {
      return Boolean(mapEvaluator.player.diplomacyStatus.metPlayers[player.id]);
    });

    const declarableNeighbors = metNeighborPlayers.filter(player =>
    {
      return mapEvaluator.player.diplomacyStatus.canDeclareWarOn(player);
    });

    const currentObjectivesByTarget = this.getObjectivesByTarget(currentObjectives);

    return declarableNeighbors.map(player =>
    {
      const score = mapEvaluator.getDesireToGoToWarWith(player) *
        mapEvaluator.getAbilityToGoToWarWith(player);

      if (currentObjectivesByTarget.has(player))
      {
        const ongoing = currentObjectivesByTarget.get(player);
        ongoing.score = score;
        return ongoing;
      }
      else
      {
        return new DeclareWar(score, player);
      }
    });
  }
  public static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForWar;
  }

  public execute(afterDoneCallback: () => void): void
  {
    this.diplomacyStatus.declareWarOn(this.target);
    afterDoneCallback();
  }
}
