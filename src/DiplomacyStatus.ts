import app from "./App"; // TODO global
import {activeModuleData} from "./activeModuleData";
import eventManager from "./eventManager";

import {AttitudeModifier} from "./AttitudeModifier";
import DiplomacyEvaluation from "./DiplomacyEvaluation";
import DiplomacyState from "./DiplomacyState";
import Player from "./Player";

import AttitudeModifierSaveData from "./savedata/AttitudeModifierSaveData";
import DiplomacyStatusSaveData from "./savedata/DiplomacyStatusSaveData";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";


export default class DiplomacyStatus
{
  player: Player;
  baseOpinion: number;

  metPlayers:
  {
    [playerId: number]: Player;
  } = {};

  statusByPlayer:
  {
    [playerId: number]: DiplomacyState,
  } = {};

  attitudeModifiersByPlayer:
  {
    [playerId: number]: AttitudeModifier[];
  } = {};

  listeners:
  {
    [name: string]: Function[];
  } = {};

  constructor(player: Player)
  {
    this.player = player;
    this.addEventListeners();
  }
  addEventListeners()
  {
    for (let key in activeModuleData.Templates.AttitudeModifiers)
    {
      const template = activeModuleData.Templates.AttitudeModifiers[key];
      if (template.triggers)
      {
        for (let i = 0; i < template.triggers.length; i++)
        {
          const listenerKey = template.triggers[i];
          const listener = eventManager.addEventListener(listenerKey,
            this.triggerAttitudeModifier.bind(this, template));

          if (!this.listeners[listenerKey])
          {
            this.listeners[listenerKey] = [];
          }
          this.listeners[listenerKey].push(listener);
        }
      }
    }
  }
  destroy()
  {
    for (let key in this.listeners)
    {
      for (let i = 0; i < this.listeners[key].length; i++)
      {
        eventManager.removeEventListener(key, this.listeners[key][i]);
      }
    }
  }
  removePlayer(player: Player)
  {
    ["metPlayers", "statusByPlayer", "attitudeModifiersByPlayer"].forEach(prop =>
    {
      this[prop][player.id] = null;
      delete this[prop][player.id];
    });
  }
  getBaseOpinion()
  {
    if (isFinite(this.baseOpinion)) return this.baseOpinion;

    const friendliness = this.player.AIController.personality.friendliness;

    this.baseOpinion = Math.round((friendliness - 0.5) * 10);

    return this.baseOpinion;
  }

  handleDiplomaticStatusUpdate()
  {
    eventManager.dispatchEvent("diplomaticStatusUpdated");
  }
  getOpinionOf(player: Player)
  {
    const baseOpinion = this.getBaseOpinion();

    const attitudeModifiers = this.attitudeModifiersByPlayer[player.id];
    let modifierOpinion = 0;

    for (let i = 0; i < attitudeModifiers.length; i++)
    {
      modifierOpinion += attitudeModifiers[i].getAdjustedStrength();
    }

    return Math.round(baseOpinion + modifierOpinion);
  }
  getUnMetPlayerCount()
  {
    return app.game.playerOrder.length - Object.keys(this.metPlayers).length;
  }
  meetPlayer(player: Player)
  {
    if (this.metPlayers[player.id] || player === this.player) return;
    else
    {
      this.metPlayers[player.id] = player;
      this.statusByPlayer[player.id] = DiplomacyState.coldWar;
      this.attitudeModifiersByPlayer[player.id] = [];
      player.diplomacyStatus.meetPlayer(this.player);
    }
  }
  canDeclareWarOn(player: Player)
  {
    return this.statusByPlayer[player.id] < DiplomacyState.war;
  }
  canMakePeaceWith(player: Player)
  {
    return this.statusByPlayer[player.id] > DiplomacyState.peace;
  }
  declareWarOn(targetPlayer: Player)
  {
    if (this.statusByPlayer[targetPlayer.id] >= DiplomacyState.war)
    {
      // TODO
      console.error("Players " + this.player.id + " and " + targetPlayer.id + " are already at war");
      return;
    }
    this.statusByPlayer[targetPlayer.id] = DiplomacyState.war;
    targetPlayer.diplomacyStatus.statusByPlayer[this.player.id] = DiplomacyState.war;

    eventManager.dispatchEvent("addDeclaredWarAttitudeModifier", targetPlayer, this.player);
    activeModuleData.scripts.get(activeModuleData.scripts.diplomacy.onWarDeclaration).forEach(script =>
    {
      script(this.player, targetPlayer);
    });
  }

  makePeaceWith(player: Player)
  {
    if (this.statusByPlayer[player.id] <= DiplomacyState.peace)
    {
      throw new Error("Players " + this.player.id + " and " + player.id + " are already at peace");
    }

    this.statusByPlayer[player.id] = DiplomacyState.peace;
    player.diplomacyStatus.statusByPlayer[this.player.id] = DiplomacyState.peace;
  }

  canAttackFleetOfPlayer(player: Player)
  {
    if (player.isIndependent) return true;

    if (this.statusByPlayer[player.id] >= DiplomacyState.coldWar)
    {
      return true;
    }

    return false;
  }
  canAttackBuildingOfPlayer(player: Player)
  {
    if (player.isIndependent) return true;

    if (this.statusByPlayer[player.id] >= DiplomacyState.war)
    {
      return true;
    }

    return false;
  }

  getModifierOfSameType(player: Player, modifier: AttitudeModifier)
  {
    const modifiers = this.attitudeModifiersByPlayer[player.id];

    for (let i = 0; i < modifiers.length; i++)
    {
      if (modifiers[i].template.type === modifier.template.type)
      {
        return modifiers[i];
      }
    }

    return null;
  }

  addAttitudeModifier(player: Player, modifier: AttitudeModifier)
  {
    if (!this.attitudeModifiersByPlayer[player.id])
    {
      this.attitudeModifiersByPlayer[player.id] = [];
    }

    const sameType = this.getModifierOfSameType(player, modifier);
    if (sameType)
    {
      sameType.refresh(modifier);
      return;
    }

    this.attitudeModifiersByPlayer[player.id].push(modifier);
  }
  triggerAttitudeModifier(template: AttitudeModifierTemplate, player: Player, source: Player)
  {
    if (player !== this.player) return;

    const modifier = new AttitudeModifier(
    {
      template: template,
      startTurn: app.game.turnNumber,
    });
    this.addAttitudeModifier(source, modifier);
  }

  processAttitudeModifiersForPlayer(player: Player, evaluation: DiplomacyEvaluation)
  {
    /*
    remove modifiers that should be removed
    add modifiers that should be added. throw if type was already removed
    set new strength for modifier
     */
    const modifiersByPlayer = this.attitudeModifiersByPlayer;
    const allModifiers = activeModuleData.Templates.AttitudeModifiers;

    const playerModifiers = modifiersByPlayer[player.id];

    const activeModifiers:
    {
      [modifierType: string]: AttitudeModifier,
    } = {};

    // debugging
    const modifiersAdded:
    {
      [modifierType: string]: AttitudeModifier,
    } = {};
    const modifiersRemoved:
    {
      [modifierType: string]: AttitudeModifier,
    } = {};

    // remove modifiers & build active modifiers index
    for (let i = playerModifiers.length - 1; i >= 0; i--)
    {
      const modifier = playerModifiers[i];
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
    for (let modifierType in allModifiers)
    {
      const template = allModifiers[modifierType];

      let modifier: AttitudeModifier;
      modifier = activeModifiers[template.type];
      const alreadyHasModifierOfType = modifier;

      if (!alreadyHasModifierOfType && !template.triggers)
      {
        if (!template.startCondition)
        {
          throw new Error("Attitude modifier has no start condition or triggers");
        }
        else
        {
          const shouldStart = template.startCondition(evaluation);

          if (shouldStart)
          {
            modifier = new AttitudeModifier(
            {
              template: template,
              startTurn: evaluation.currentTurn,
            });

            playerModifiers.push(modifier);
            modifiersAdded[template.type] = modifier;
          }
        }
      }


      if (modifier)
      {
        modifier.updateWithEvaluation(evaluation);
      }
    }
  }

  serialize(): DiplomacyStatusSaveData
  {
    const metPlayerIds: number[] = [];
    for (let playerId in this.metPlayers)
    {
      metPlayerIds.push(this.metPlayers[playerId].id);
    }

    const attitudeModifiersByPlayer:
    {
      [playerId: number]: AttitudeModifierSaveData[];
    } = {};
    for (let playerId in this.attitudeModifiersByPlayer)
    {
      const serializedModifiers =
        this.attitudeModifiersByPlayer[playerId].map(function(modifier)
        {
          return modifier.serialize();
        });
      attitudeModifiersByPlayer[playerId] = serializedModifiers;
    }


    const data: DiplomacyStatusSaveData =
    {
      metPlayerIds: metPlayerIds,
      statusByPlayer: this.statusByPlayer,
      attitudeModifiersByPlayer: attitudeModifiersByPlayer,
    };

    return data;
  }
}
