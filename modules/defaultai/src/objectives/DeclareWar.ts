import {Player} from "core/src/player/Player";
import {PlayerDiplomacy} from "core/src/diplomacy/PlayerDiplomacy";
import {GrandStrategyAi} from "../mapai/GrandStrategyAi";
import {MapEvaluator} from "../mapai/MapEvaluator";

import {DiplomaticObjective} from "./common/DiplomaticObjective";
import {Objective} from "./common/Objective";


// @ts-ignore 2417
export class DeclareWar extends DiplomaticObjective
{
  public static readonly type = "DeclareWar";
  public readonly type = "DeclareWar";

  public readonly target: Player;

  protected constructor(score: number, target: Player, playerDiplomacy: PlayerDiplomacy)
  {
    super(score, playerDiplomacy);
    this.target = target;
  }

  protected static createObjectives(mapEvaluator: MapEvaluator, allOngoingObjectives: Objective[]): DeclareWar[]
  {
    const metNeighborPlayers = mapEvaluator.player.getNeighboringPlayers().filter(player =>
    {
      return mapEvaluator.player.diplomacy.hasMetPlayer(player);
    });

    const declarableNeighbors = metNeighborPlayers.filter(player =>
    {
      return mapEvaluator.player.diplomacy.canDeclareWarOn(player);
    });

    return declarableNeighbors.map(player =>
    {
      const score = mapEvaluator.getDesireToGoToWarWith(player) *
        mapEvaluator.getAbilityToGoToWarWith(player);

      return new DeclareWar(score, player, mapEvaluator.player.diplomacy);
    });
  }
  protected static evaluatePriority(mapEvaluator: MapEvaluator, grandStrategyAi: GrandStrategyAi): number
  {
    return grandStrategyAi.desireForWar;
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
    this.playerDiplomacy.declareWarOn(this.target);
    afterDoneCallback();
  }
}
