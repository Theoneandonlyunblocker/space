/// <reference path="eventmanager.ts" />

/// <reference path="player.ts" />
/// <reference path="attitudemodifier.ts" />

module Rance
{
  export enum DiplomaticState
  {
    peace,
    coldWar,
    war
  }
  export class DiplomacyStatus
  {
    player: Player;

    metPlayers:
    {
      [playerId: number]: Player;
    } = {};

    statusByPlayer:
    {
      [playerId: number]: DiplomaticState
    } = {};

    attitudeModifiersByPlayer:
    {
      [playerId: number]: AttitudeModifier[];
    } = {};

    constructor(player: Player)
    {
      this.player = player;
    }

    handleDiplomaticStatusUpdate()
    {
      eventManager.dispatchEvent("diplomaticStatusUpdated");
    }

    meetPlayer(player: Player)
    {
      if (this.metPlayers[player.id]) return;
      else
      {
        this.metPlayers[player.id] = player;
        this.statusByPlayer[player.id] = DiplomaticState.coldWar;
        player.diplomacyStatus.meetPlayer(this.player);
      }
    }

    declareWarOn(player: Player)
    {
      this.statusByPlayer[player.id] = DiplomaticState.war;
      player.diplomacyStatus[this.player.id] = DiplomaticState.war;
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
