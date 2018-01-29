import {activeModuleData} from "./activeModuleData";
import eventManager from "./eventManager";

import {AttitudeModifier} from "./AttitudeModifier";
import DiplomacyEvaluation from "./DiplomacyEvaluation";
import DiplomacyState from "./DiplomacyState";
import Player from "./Player";
import {default as ValuesByPlayer} from "./ValuesByPlayer";

import AttitudeModifierSaveData from "./savedata/AttitudeModifierSaveData";
import PlayerDiplomacySaveData from "./savedata/PlayerDiplomacySaveData";


export default class PlayerDiplomacy
{
  public readonly statusByPlayer: ValuesByPlayer<DiplomacyState>;
  public readonly attitudeModifiersByPlayer: ValuesByPlayer<AttitudeModifier[]>;

  private readonly player: Player;
  private listeners:
  {
    [name: string]: Function[];
  } = {};

  constructor(player: Player, allPlayersInGame: Player[])
  {
    this.player = player;

    const validPlayers = allPlayersInGame.filter(gamePlayer => this.canDoDiplomacyWithPlayer(gamePlayer));

    this.statusByPlayer = new ValuesByPlayer<DiplomacyState>(validPlayers, () =>
    {
      return DiplomacyState.Unmet;
    });
    this.attitudeModifiersByPlayer = new ValuesByPlayer<AttitudeModifier[]>(validPlayers, () =>
    {
      return [];
    });
  }

  public destroy(): void
  {
    for (let key in this.listeners)
    {
      for (let i = 0; i < this.listeners[key].length; i++)
      {
        eventManager.removeEventListener(key, this.listeners[key][i]);
      }
    }
  }
  public getOpinionOf(player: Player): number
  {
    const attitudeModifiers = this.attitudeModifiersByPlayer.get(player);

    const modifierOpinion = attitudeModifiers.map(modifier =>
    {
      return modifier.getAdjustedStrength();
    }).reduce((totalOpinion, currentOpinion) =>
    {
      return totalOpinion + currentOpinion;
    }, 0);

    return Math.round(modifierOpinion);
  }
  public canDoDiplomacyWithPlayer(player: Player): boolean
  {
    return player !== this.player &&
      !player.isIndependent &&
      !player.isDead;
  }
  public hasMetPlayer(player: Player): boolean
  {
    return this.statusByPlayer.get(player) > DiplomacyState.Unmet;
  }
  public meetPlayerIfNeeded(player: Player): void
  {
    if (!this.hasMetPlayer(player) && this.canDoDiplomacyWithPlayer(player))
    {
      this.triggerMeetingWithPlayer(player);
      player.diplomacy.triggerMeetingWithPlayer(this.player);
    }
  }
  public getMetPlayers(): Player[]
  {
    return this.statusByPlayer.filter((player, state) =>
    {
      return state > DiplomacyState.Unmet;
    }).mapToArray(player =>
    {
      return player;
    });
  }
  public hasAnUnmetPlayer(): boolean
  {
    return this.statusByPlayer.some((player, state) =>
    {
      return state === DiplomacyState.Unmet;
    });
  }
  public canDeclareWarOn(player: Player): boolean
  {
    return this.hasMetPlayer(player) && this.statusByPlayer.get(player) < DiplomacyState.War;
  }
  public canMakePeaceWith(player: Player): boolean
  {
    return this.hasMetPlayer(player) && this.statusByPlayer.get(player) > DiplomacyState.Peace;
  }
  public declareWarOn(targetPlayer: Player): void
  {
    if (this.statusByPlayer.get(targetPlayer) >= DiplomacyState.War)
    {
      // TODO 2017.07.25 | default ai module does this sometimes
      console.error(`Players ${this.player.id} and ${targetPlayer.id} are already at war`);

      return;
    }

    this.statusByPlayer.set(targetPlayer, DiplomacyState.War);
    targetPlayer.diplomacy.statusByPlayer.set(this.player, DiplomacyState.War);

    activeModuleData.scripts.diplomacy.onWarDeclaration.forEach(script =>
    {
      script(this.player, targetPlayer);
    });
  }
  public makePeaceWith(targetPlayer: Player): void
  {
    if (!this.canMakePeaceWith(targetPlayer))
    {
      console.error(`Players ${this.player.id} and ${targetPlayer.id} can't delcare peace`);
    }

    this.statusByPlayer.set(targetPlayer, DiplomacyState.Peace);
    targetPlayer.diplomacy.statusByPlayer.set(this.player, DiplomacyState.Peace);
  }
  public canAttackFleetOfPlayer(player: Player): boolean
  {
    if (player.isIndependent)
    {
      return true;
    }

    if (this.statusByPlayer.get(player) >= DiplomacyState.ColdWar)
    {
      return true;
    }

    return false;
  }
  public canAttackBuildingOfPlayer(player: Player): boolean
  {
    if (player.isIndependent)
    {
      return true;
    }

    if (this.statusByPlayer.get(player) >= DiplomacyState.War)
    {
      return true;
    }

    return false;
  }
  public addAttitudeModifier(player: Player, modifier: AttitudeModifier)
  {
    const sameType = this.getModifierOfSameType(player, modifier);
    if (sameType)
    {
      sameType.refresh(modifier);

      return;
    }

    this.attitudeModifiersByPlayer.get(player).push(modifier);
  }
  public processAttitudeModifiersForPlayer(player: Player, evaluation: DiplomacyEvaluation)
  {
    /*
    remove modifiers that should be removed
    add modifiers that should be added. throw if type was already removed
    set new strength for modifier
     */
    const allModifiers = activeModuleData.Templates.AttitudeModifiers;

    const modifiersForPlayer = this.attitudeModifiersByPlayer.get(player);

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
    for (let i = modifiersForPlayer.length - 1; i >= 0; i--)
    {
      const modifier = modifiersForPlayer[i];
      if (modifier.shouldEnd(evaluation))
      {
        modifiersForPlayer.splice(i, 1);
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
      const alreadyHasModifierOfType = Boolean(modifier);

      if (!alreadyHasModifierOfType && template.startCondition)
      {
        const shouldStart = template.startCondition(evaluation);

        if (shouldStart)
        {
          modifier = new AttitudeModifier(
          {
            template: template,
            startTurn: evaluation.currentTurn,
            evaluation: evaluation,
          });

          modifiersForPlayer.push(modifier);
          modifiersAdded[template.type] = modifier;
        }
      }
      else if (modifier)
      {
        modifier.update(evaluation);
      }
    }
  }
  public serialize(): PlayerDiplomacySaveData
  {
    const attitudeModifiersByPlayer:
    {
      [playerId: number]: AttitudeModifierSaveData[];
    } = {};

    this.attitudeModifiersByPlayer.forEach((player, modifiers) =>
    {
      attitudeModifiersByPlayer[player.id] = modifiers.map(modifier => modifier.serialize());
    });

    const data: PlayerDiplomacySaveData =
    {
      statusByPlayer: this.statusByPlayer.toObject(),
      attitudeModifiersByPlayer: attitudeModifiersByPlayer,
    };

    return data;
  }

  private getModifierOfSameType(player: Player, modifier: AttitudeModifier): AttitudeModifier | null
  {
    const modifiers = this.attitudeModifiersByPlayer.get(player);

    for (let i = 0; i < modifiers.length; i++)
    {
      if (modifiers[i].template.type === modifier.template.type)
      {
        return modifiers[i];
      }
    }

    return null;
  }
  private triggerMeetingWithPlayer(player: Player): void
  {
    this.statusByPlayer.set(player, DiplomacyState.ColdWar);
    activeModuleData.scripts.diplomacy.onFirstMeeting.forEach(script =>
    {
      script(this.player, player);
    });
  }
}
