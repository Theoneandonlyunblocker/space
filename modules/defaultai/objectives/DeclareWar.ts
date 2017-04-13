import {DiplomaticObjective} from "./common/DiplomaticObjective";
import {Objective} from "./common/Objective";

import {GrandStrategyAI} from "../mapai/GrandStrategyAI";
import MapEvaluator from "../mapai/MapEvaluator";

import DiplomacyStatus from "../../../src/DiplomacyStatus";
import Player from "../../../src/Player";

export class DeclareWar extends DiplomaticObjective
{
  public static readonly type = "DeclareWar";
  public readonly type = "DeclareWar";

  public readonly target: Player;

  protected constructor(score: number, target: Player, diplomacyStatus: DiplomacyStatus)
  {
    super(score, diplomacyStatus);
    this.target = target;
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): DeclareWar[]
  {
    const metNeighborPlayers = mapEvaluator.player.getNeighboringPlayers().filter(player =>
    {
      return Boolean(mapEvaluator.player.diplomacyStatus.metPlayers[player.id]);
    });

    const declarableNeighbors = metNeighborPlayers.filter(player =>
    {
      return mapEvaluator.player.diplomacyStatus.canDeclareWarOn(player);
    });

    return declarableNeighbors.map(player =>
    {
      const score = mapEvaluator.getDesireToGoToWarWith(player) *
        mapEvaluator.getAbilityToGoToWarWith(player);

      return new DeclareWar(score, player, mapEvaluator.player.diplomacyStatus);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAI: GrandStrategyAI): number
  {
    return grandStrategyAI.desireForWar;
  }
  protected static updateOngoingObjectivesList(
    allOngoingObjectives: Objective[],
    createdObjectives: DeclareWar[],
  ): Objective[]
  {
    return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
  }

  public execute(afterDoneCallback: () => void): void
  {
    this.diplomacyStatus.declareWarOn(this.target);
    afterDoneCallback();
  }
}
