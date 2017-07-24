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
  public turnNumber: number;
  public readonly players: Player[] = [];
  public readonly galaxyMap: GalaxyMap;
  public hasEnded: boolean = false;
  public playerToAct: Player;
  public gameStorageKey: string;

  private actingPlayerIndex: number = 0;


  constructor(map: GalaxyMap, players: Player[])
  {
    this.galaxyMap = map;
    this.players = [...players]

    // TODO 2017.07.24 | this seems kinda weird
    if (map.independents)
    {
      this.players.push(...map.independents);
      map.independents = null;
      delete map.independents;
    }

    this.turnNumber = 1;
  }

  private static playerIsPartOfGame(player: Player): boolean
  {
    return !player.isDead;
  }
  private static playerCanAct(player: Player): boolean
  {
    return Game.playerIsPartOfGame(player) && !player.isIndependent;
  }

  public destroy()
  {
    this.players.forEach(player =>
    {
      player.destroy();
    });
  }
  public endTurn()
  {
    this.setNextPlayer();

    while (this.playerToAct.isDead)
    {
      if (this.playerToAct === activePlayer)
      {
        this.endGame();

        return;
      }

      this.setNextPlayer();
    }

    this.processPlayerStartTurn(this.playerToAct);

    if (!Game.playerCanAct(this.playerToAct))
    {
      this.endTurn();

      return;
    }

    eventManager.dispatchEvent("endTurn", null);
    eventManager.dispatchEvent("updateSelection", null);

    if (this.playerToAct.isAI)
    {
      this.playerToAct.AIController.processTurn(this.endTurn.bind(this));
    }
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

  // for every player, not just human
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
  // after each player has has a go
  private processNewRoundOfPlayStart(): void
  {
    this.turnNumber++;
    activeNotificationLog.currentTurn = this.turnNumber;
  }
  private setNextPlayer()
  {
    this.actingPlayerIndex = (this.actingPlayerIndex + 1) % this.players.length;
    this.playerToAct = this.players[this.actingPlayerIndex];

    if (this.actingPlayerIndex === 0)
    {
      this.processNewRoundOfPlayStart();
    }
  }
  private serialize(): GameSaveData
  {
    const data: GameSaveData =
    {
      turnNumber: this.turnNumber,
      galaxyMap: this.galaxyMap.serialize(),
      players: this.players.map(player =>
      {
        return player.serialize();
      }),
      // TODO 2017.07.14 | does this belong here?
      notificationLog: activeNotificationLog.serialize(),
      units: this.players.map(player =>
      {
        return player.units.map(unit =>
        {
          return unit.serialize();
        });
      }).reduce((allUnits, playerUnits) =>
      {
        return allUnits.concat(playerUnits);
      }, []),
      items: this.players.map(player =>
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
