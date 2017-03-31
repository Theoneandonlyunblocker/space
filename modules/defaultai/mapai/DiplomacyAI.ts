import DiplomacyStatus from "../../../src/DiplomacyStatus";
import Game from "../../../src/Game";
import Player from "../../../src/Player";

import MapEvaluator from "./MapEvaluator";
import {ObjectivesAI} from "./ObjectivesAI";

export default class DiplomacyAI
{
  private game: Game;

  private player: Player;
  private diplomacyStatus: DiplomacyStatus;

  private mapEvaluator: MapEvaluator;
  private objectivesAI: ObjectivesAI;

  constructor(
    mapEvaluator: MapEvaluator,
    objectivesAI: ObjectivesAI,
    game: Game,
  )
  {
    this.game = game;

    this.player = mapEvaluator.player;
    this.diplomacyStatus = this.player.diplomacyStatus;

    this.mapEvaluator = mapEvaluator;
    this.objectivesAI = objectivesAI;
  }
  public setAttitudes()
  {
    const diplomacyEvaluations =
      this.mapEvaluator.getDiplomacyEvaluations(this.game.turnNumber);

    for (let playerId in diplomacyEvaluations)
    {
      this.diplomacyStatus.processAttitudeModifiersForPlayer(
        this.diplomacyStatus.metPlayers[playerId], diplomacyEvaluations[playerId],
      );
    }
  }
}
