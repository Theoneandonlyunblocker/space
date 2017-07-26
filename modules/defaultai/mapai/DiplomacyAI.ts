import DiplomacyStatus from "../../../src/DiplomacyStatus";
import Game from "../../../src/Game";
import Player from "../../../src/Player";

import MapEvaluator from "./MapEvaluator";

export default class DiplomacyAI
{
  private game: Game;

  private player: Player;
  private diplomacyStatus: DiplomacyStatus;

  private mapEvaluator: MapEvaluator;

  constructor(
    mapEvaluator: MapEvaluator,
    game: Game,
  )
  {
    this.game = game;

    this.player = mapEvaluator.player;
    this.diplomacyStatus = this.player.diplomacyStatus;

    this.mapEvaluator = mapEvaluator;
  }

  public setAttitudes()
  {
    const diplomacyEvaluations =
      this.mapEvaluator.getDiplomacyEvaluations(this.game.turnNumber);

    diplomacyEvaluations.forEach((player, evaluation) =>
    {
      this.diplomacyStatus.processAttitudeModifiersForPlayer(player, evaluation);
    });
  }
}
