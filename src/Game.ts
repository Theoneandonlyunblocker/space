import app from "./App"; // TODO global
import GalaxyMap from "./GalaxyMap";
import Manufactory from "./Manufactory";
import Player from "./Player";
import {activeNotificationLog} from "./activeNotificationLog";
import {activePlayer} from "./activePlayer";
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
  public playerToAct: Player;
  public hasEnded: boolean = false;

  gameStorageKey: string;

  constructor(map: GalaxyMap, players: Player[])
  {
    this.galaxyMap = map;
    // TODO 2017.07.24 | this seems kinda weird
    if (map.independents)
    {
      this.independents = map.independents;
      map.independents = null;
      delete map.independents;
    }

    this.playerOrder = [...players];
    this.turnNumber = 1;
  }

  public destroy()
  {
    for (let i = 0; i < this.playerOrder.length; i++)
    {
      this.playerOrder[i].destroy();
    }
    for (let i = 0; i < this.independents.length; i++)
    {
      this.independents[i].destroy();
    }
  }
  public endTurn()
  {
    this.setNextPlayer();

    while (this.playerToAct.controlledLocations.length === 0)
    {
      this.killPlayer(this.playerToAct);
      this.playerToAct = this.playerOrder[0];
    }

    this.processPlayerStartTurn(this.playerToAct);
    activeNotificationLog.currentTurn = this.turnNumber;

    if (this.playerToAct.isAI)
    {
      this.playerToAct.AIController.processTurn(this.endTurn.bind(this));
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
  public save(name: string)
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
      cameraLocation: app.renderer.camera.getCenterPosition(),
    };

    const stringified = JSON.stringify(fullSaveData);

    localStorage.setItem(saveString, stringified);
  }

  private processPlayerStartTurn(player: Player)
  {
    player.units.forEach(unit =>
    {
      unit.addHealth(unit.getHealingForGameTurnStart());

      const passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
      if (passiveSkillsByPhase.atTurnStart)
      {
        for (let i = 0; i < passiveSkillsByPhase.atTurnStart.length; i++)
        {
          const skill = passiveSkillsByPhase.atTurnStart[i];
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

      const allResourceIncomeData = player.getResourceIncome();
      for (let resourceType in allResourceIncomeData)
      {
        const resourceData = allResourceIncomeData[resourceType];
        player.addResource(resourceData.resource, resourceData.amount);
      }

      player.playerTechnology.allocateResearchPoints(player.getResearchSpeed());
      player.getAllManufactories().forEach(function(manufactory: Manufactory)
      {
        manufactory.buildAllThings();
      });
    }
  }
  private setNextPlayer()
  {
    this.playerOrder.push(this.playerOrder.shift());

    this.playerToAct = this.playerOrder[0];
  }
  // TODO 2017.07.24 | can't all this be done in Player#die() ?
  private killPlayer(playerToKill: Player)
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

    // TODO 2017.07.24 | keep dead players around
    this.playerOrder.forEach(player =>
    {
      player.diplomacyStatus.removePlayer(playerToKill);
    });

    playerToKill.die();
    playerToKill.destroy();

    if (playerToKill === activePlayer)
    {
      this.endGame();
    }
  }
  private getAllPlayers(): Player[]
  {
    return this.playerOrder.concat(this.independents);
  }
  private serialize(): GameSaveData
  {
    const data: GameSaveData =
    {
      turnNumber: this.turnNumber,
      galaxyMap: this.galaxyMap.serialize(),
      players: this.getAllPlayers().map(player =>
      {
        return player.serialize();
      }),
      // TODO 2017.07.14 | does this belong here?
      notificationLog: activeNotificationLog.serialize(),
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
  private endGame(): void
  {
    this.hasEnded = true;
  }
}
