
import app from "./App"; // TODO global
import GalaxyMap from "./GalaxyMap";
import Manufactory from "./Manufactory";
import NotificationLog from "./NotificationLog";
import Player from "./Player";
import eventManager from "./eventManager";
import idGenerators from "./idGenerators";

import FullSaveData from "./savedata/FullSaveData";
import GameSaveData from "./savedata/GameSaveData";


export default class Game
{
  turnNumber: number;
  independents: Player[] = [];
  playerOrder: Player[];
  galaxyMap: GalaxyMap;
  humanPlayer: Player;
  activePlayer: Player;
  public hasEnded: boolean = false;

  notificationLog: NotificationLog;

  gameStorageKey: string;

  constructor(map: GalaxyMap,
    players: Player[], humanPlayer: Player)
  {
    this.galaxyMap = map;
    if (map.independents)
    {
      this.independents = map.independents;
      map.independents = null;
      delete map.independents;
    }

    this.playerOrder = players;
    this.humanPlayer = humanPlayer;
    this.turnNumber = 1;
  }
  destroy()
  {
    this.notificationLog.destroy();
    this.notificationLog = null;
    for (let i = 0; i < this.playerOrder.length; i++)
    {
      this.playerOrder[i].destroy();
    }
    for (let i = 0; i < this.independents.length; i++)
    {
      this.independents[i].destroy();
    }
  }

  endTurn()
  {
    this.setNextPlayer();

    while (this.activePlayer.controlledLocations.length === 0)
    {
      this.killPlayer(this.activePlayer);
      this.activePlayer = this.playerOrder[0];
    }

    this.processPlayerStartTurn(this.activePlayer);
    this.notificationLog.setTurn(this.turnNumber, !this.activePlayer.isAI);

    if (this.activePlayer.isAI)
    {
      this.activePlayer.AIController.processTurn(this.endTurn.bind(this));
    }
    else
    {
      this.turnNumber++;

      for (let i = 0; i < this.independents.length; i++)
      {
        this.processPlayerStartTurn(this.independents[i]);
      }

    }

    eventManager.dispatchEvent("endTurn", null);
    eventManager.dispatchEvent("updateSelection", null);
  }
  processPlayerStartTurn(player: Player)
  {
    player.units.forEach(unit =>
    {
      unit.addHealth(unit.getHealingForGameTurnStart());

      var passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
      if (passiveSkillsByPhase.atTurnStart)
      {
        for (let i = 0; i < passiveSkillsByPhase.atTurnStart.length; i++)
        {
          var skill = passiveSkillsByPhase.atTurnStart[i];
          for (let j = 0; j < skill.atTurnStart.length; j++)
          {
            skill.atTurnStart[j](unit);
          }
        }
      }

      unit.resetMovePoints();
      unit.timesActedThisTurn = 0;
    });

    if (!player.isIndependent)
    {
      player.money += player.getIncome();

      var allResourceIncomeData = player.getResourceIncome();
      for (let resourceType in allResourceIncomeData)
      {
        var resourceData = allResourceIncomeData[resourceType];
        player.addResource(resourceData.resource, resourceData.amount);
      }

      player.playerTechnology.allocateResearchPoints(player.getResearchSpeed());
      player.getAllManufactories().forEach(function(manufactory: Manufactory)
      {
        manufactory.buildAllThings();
      });
    }
  }
  setNextPlayer()
  {
    this.playerOrder.push(this.playerOrder.shift());

    this.activePlayer = this.playerOrder[0];
  }
  killPlayer(playerToKill: Player)
  {
    const playerOrderIndex = this.playerOrder.indexOf(playerToKill);

    if (playerOrderIndex !== -1)
    {
      this.playerOrder.splice(playerOrderIndex, 1);
    }
    else
    {
      const independentsIndex = this.independents.indexOf(playerToKill);
      if (independentsIndex !== -1)
      {
        this.independents.splice(independentsIndex, 1);
      }
    }

    this.playerOrder.forEach(player =>
    {
      player.diplomacyStatus.removePlayer(playerToKill);
    });

    playerToKill.die();
    playerToKill.destroy();

    if (playerToKill === this.humanPlayer)
    {
      this.endGame();
    }
  }
  public getAllPlayers(): Player[]
  {
    return this.playerOrder.concat(this.independents);
  }
  private endGame(): void
  {
    this.hasEnded = true;
  }
  serialize(): GameSaveData
  {
    const data: GameSaveData =
    {
      turnNumber: this.turnNumber,
      galaxyMap: this.galaxyMap.serialize(),
      players: this.getAllPlayers().map(player =>
      {
        return player.serialize();
      }),
      humanPlayerId: this.humanPlayer.id,
      notificationLog: this.notificationLog.serialize(),
      units: this.getAllPlayers().map(player =>
      {
        return player.units.map(unit =>
        {
          return unit.serialize();
        });
      }).reduce((allUnits, playerUnits) =>
      {
        return allUnits.concat(playerUnits);
      }, []),
      items: this.getAllPlayers().map(player =>
      {
        return player.items.map(item => item.serialize());
      }).reduce((allItems, playerItems) =>
      {
        return allItems.concat(playerItems);
      }, []),
    };

    return data;
  }
  save(name: string)
  {
    const saveString = "Rance.Save." + name;
    this.gameStorageKey = saveString;

    const date = new Date();
    const gameData = this.serialize();

    const fullSaveData: FullSaveData =
    {
      name: name,
      date: date,
      gameData: gameData,
      idGenerators: idGenerators.serialize(),
      cameraLocation: app.renderer.camera.getCenterPosition()
    };

    const stringified = JSON.stringify(fullSaveData);

    localStorage.setItem(saveString, stringified);
  }
}
