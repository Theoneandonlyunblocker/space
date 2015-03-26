/// <reference path="player.ts" />
/// <reference path="attitudemodifier.ts" />

module Rance
{
  export class DiplomacyStatus
  {
    player: Player;

    metPlayersById:
    {
      [playerId: number]: Player;
    } = {};

    attitudeModifiersByPlayer:
    {
      [playerId: number]: AttitudeModifier[];
    } = {};

    constructor(player: Player)
    {
      this.player = player;
    }

    serialize()
    {
      var data: any = {};

      data.metPlayerIds = [];
      for (var playerId in this.metPlayers)
      {
        data.metPlayerIds.push(this.metPlayers[playerId].id);
      }

      data.statusByPlayer = this.statusByPlayer;

      data.attitudeModifiersByPlayer = [];
      for (var playerId in this.attitudeModifiersByPlayer)
      {
        var serializedModifiers =
          this.attitudeModifiersByPlayer[playerId].map(function(modifier)
          {
            return modifier.serialize();
          });
        data.attitudeModifiersByPlayer[playerId] = serializedModifiers;
      }


      return data;
    }
  }
}
