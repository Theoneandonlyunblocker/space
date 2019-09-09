import {Game} from "core/src/game/Game";
import {Player} from "core/src/player/Player";
import {PlayerDiplomacy} from "core/src/diplomacy/PlayerDiplomacy";

import {MapEvaluator} from "./MapEvaluator";


export class DiplomacyAi
{
  private game: Game;

  private player: Player;
  private playerDiplomacy: PlayerDiplomacy;

  private mapEvaluator: MapEvaluator;

  constructor(
    mapEvaluator: MapEvaluator,
    game: Game,
  )
  {
    this.game = game;

    this.player = mapEvaluator.player;
    this.playerDiplomacy = this.player.diplomacy;

    this.mapEvaluator = mapEvaluator;
  }

  public setAttitudes()
  {
    const diplomacyEvaluations =
      this.mapEvaluator.getDiplomacyEvaluations(this.game.turnNumber);

    diplomacyEvaluations.forEach((player, evaluation) =>
    {
      this.playerDiplomacy.processAttitudeModifiersForPlayer(player, evaluation);
    });
  }
}
