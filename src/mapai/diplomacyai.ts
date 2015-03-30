/// <reference path="../../data/templates/attitudemodifiers.ts" />

/// <reference path="../game.ts"/>
/// <reference path="../player.ts"/>
/// <reference path="../diplomacystatus.ts"/>

/// <reference path="mapevaluator.ts"/>

module Rance
{
  export class DiplomacyAI
  {
    game: Game;

    player: Player;
    diplomacyStatus: DiplomacyStatus;

    personality: IPersonalityData;
    mapEvaluator: MapEvaluator;

    constructor(mapEvaluator: MapEvaluator, game: Game, personality: IPersonalityData)
    {
      this.game = game;
      
      this.player = mapEvaluator.player;
      this.diplomacyStatus = this.player.diplomacyStatus;

      this.mapEvaluator = mapEvaluator;
      
      this.personality = personality;
    }

    setAttitudes()
    {
      var diplomacyEvaluations =
        this.mapEvaluator.getDiplomacyEvaluations(this.game.turnNumber);

      for (var playerId in diplomacyEvaluations)
      {
        this.diplomacyStatus.processAttitudeModifiersForPlayer(
          this.diplomacyStatus.metPlayers[playerId], diplomacyEvaluations[playerId]
        );
      }
    }
  }
}
