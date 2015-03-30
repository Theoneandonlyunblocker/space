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
    baseOpinion: number;

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

    getBaseOpinion()
    {
      if (isFinite(this.baseOpinion)) return this.baseOpinion;

      var friendliness = this.player.AIController.personality.friendliness;

      this.baseOpinion = (friendliness - 0.5) * 10;

      return this.baseOpinion;
    }

    handleDiplomaticStatusUpdate()
    {
      eventManager.dispatchEvent("diplomaticStatusUpdated");
    }

    getOpinionOf(player: Player)
    {
      var baseOpinion = this.getBaseOpinion();

      var attitudeModifiers = this.attitudeModifiersByPlayer[player.id];
      var modifierOpinion = 0;

      for (var i = 0; i < attitudeModifiers.length; i++)
      {
        modifierOpinion += attitudeModifiers[i].getAdjustedStrength();
      }

      return baseOpinion + modifierOpinion;
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

    canAttackFleetOfPlayer(player: Player)
    {
      if (player.isIndependent) return true;

      if (this.statusByPlayer[player.id] >= DiplomaticState.coldWar)
      {
        return true;
      }

      return false;
    }
    canAttackBuildingOfPlayer(player: Player)
    {
      if (player.isIndependent) return true;

      if (this.statusByPlayer[player.id] >= DiplomaticState.war)
      {
        return true;
      }

      return false;
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
