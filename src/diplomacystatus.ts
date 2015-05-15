/// <reference path="eventmanager.ts" />

/// <reference path="player.ts" />
/// <reference path="attitudemodifier.ts" />

module Rance
{
  export enum DiplomaticState
  {
    peace, // no fighting
    coldWar, // fighting on neutral ground only
    war // any fighting
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

      this.baseOpinion = Math.round((friendliness - 0.5) * 10);

      return this.baseOpinion;
    }

    updateAttitudes()
    {
      if (!this.player.AIController)
      {
        return;
      }

      this.player.AIController.diplomacyAI.setAttitudes();
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

      return Math.round(baseOpinion + modifierOpinion);
    }

    meetPlayer(player: Player)
    {
      if (this.metPlayers[player.id]) return;
      else
      {
        this.metPlayers[player.id] = player;
        this.statusByPlayer[player.id] = DiplomaticState.coldWar;
        this.attitudeModifiersByPlayer[player.id] = [];
        player.diplomacyStatus.meetPlayer(this.player);
      }
    }

    canDeclareWarOn(player: Player)
    {
      return (this.statusByPlayer[player.id] < DiplomaticState.war);
    }
    canMakePeaceWith(player: Player)
    {
      return (this.statusByPlayer[player.id] > DiplomaticState.peace);
    }

    declareWarOn(player: Player)
    {
      if (this.statusByPlayer[player.id] >= DiplomaticState.war)
      {
        throw new Error("Players " + this.player.id + " and " + player.id + " are already at war");
      }
      this.statusByPlayer[player.id] = DiplomaticState.war;
      player.diplomacyStatus.statusByPlayer[this.player.id] = DiplomaticState.war;

      player.diplomacyStatus.updateAttitudes();
    }

    makePeaceWith(player: Player)
    {
      if (this.statusByPlayer[player.id] <= DiplomaticState.peace)
      {
        throw new Error("Players " + this.player.id + " and " + player.id + " are already at peace");
      }

      this.statusByPlayer[player.id] = DiplomaticState.peace;
      player.diplomacyStatus.statusByPlayer[this.player.id] = DiplomaticState.peace;

      player.diplomacyStatus.updateAttitudes();
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

    hasModifierOfSameType(player: Player, modifier: AttitudeModifier)
    {
      var modifiers = this.attitudeModifiersByPlayer[player.id];

      for (var i = 0; i < modifiers.length; i++)
      {
        if (modifiers[i].template.type === modifier.template.type)
        {
          return true;
        }
      }

      return false;
    }

    addAttitudeModifier(player: Player, modifier: AttitudeModifier)
    {
      if (!this.attitudeModifiersByPlayer[player.id])
      {
        this.attitudeModifiersByPlayer[player.id] = [];
      }

      if (this.hasModifierOfSameType(player, modifier))
      {
        return;
      }

      this.attitudeModifiersByPlayer[player.id].push(modifier);
    }

    processAttitudeModifiersForPlayer(player: Player, evaluation: IDiplomacyEvaluation)
    {
      /*
      remove modifiers that should be removed
      add modifiers that should be added. throw if type was already removed
      set new strength for modifier
       */
      var modifiersByPlayer = this.attitudeModifiersByPlayer;
      var allModifiers = Templates.AttitudeModifiers;

      for (var playerId in modifiersByPlayer)

      var playerModifiers = modifiersByPlayer[player.id];

      var activeModifiers:
      {
        [modifierType: string]: AttitudeModifier
      } = {};

      // debugging
      var modifiersAdded:
      {
        [modifierType: string]: AttitudeModifier
      } = {};
      var modifiersRemoved:
      {
        [modifierType: string]: AttitudeModifier
      } = {};

      // remove modifiers & build active modifiers index
      for (var i = playerModifiers.length - 1; i >= 0; i--)
      {
        var modifier = playerModifiers[i];
        if (modifier.shouldEnd(evaluation))
        {
          playerModifiers.splice(i, 1);
          modifiersRemoved[modifier.template.type] = modifier;
        }
        else
        {
          activeModifiers[modifier.template.type] = modifier;
        }
      }

      // loop through all modifiers
      // if modifier is not active and should start,
      // add it and mark as active
      // 
      // if modifier is active, set strength based on evaluation
      for (var modifierType in allModifiers)
      {
        var template = allModifiers[modifierType];

        var modifier: AttitudeModifier;
        modifier = activeModifiers[template.type];
        var alreadyHasModifierOfType = modifier;

        if (!alreadyHasModifierOfType && !template.triggeredOnly)
        {
          if (!template.startCondition)
          {
            throw new Error("Attitude modifier is not trigger only despite " +
              "having no start condition specified");
          }
          else
          {
            var shouldStart = template.startCondition(evaluation);

            if (shouldStart)
            {
              modifier = new AttitudeModifier(
              {
                template: template,
                startTurn: evaluation.currentTurn
              });

              playerModifiers.push(modifier);
              modifiersAdded[template.type] = modifier;
            }
          }
        }


        if (modifier)
        {
          modifier.currentTurn = evaluation.currentTurn;
          modifier.setStrength(evaluation);
        }
      }
      
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
