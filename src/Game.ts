import * as localForage from "localforage";

import app from "./App"; // TODO global
import GalaxyMap from "./GalaxyMap";
import Player from "./Player";
import {default as PlayerDiplomacy} from "./PlayerDiplomacy";
import {activePlayer} from "./activePlayer";
import eventManager from "./eventManager";
import idGenerators from "./idGenerators";
import {activeNotificationStore} from "./notifications/activeNotificationStore";

import FullSaveData from "./savedata/FullSaveData";
import GameSaveData from "./savedata/GameSaveData";
import { activeModuleData } from "./activeModuleData";
import { storageStrings } from "./storageStrings";


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
    this.players = [...players];
    this.playerToAct = players[0];

    // TODO 2017.07.24 | this seems kinda weird
    if (map.independents)
    {
      this.players.push(...map.independents);
      map.independents = null;
      delete map.independents;
    }

    this.players.filter(player =>
    {
      return !player.isIndependent && !player.isDead;
    }).forEach(player =>
    {
      player.diplomacy = new PlayerDiplomacy(player, this);
    });

    this.turnNumber = 1;
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
    if (!this.playerToAct.isAi)
    {
      activeModuleData.scripts.game.beforePlayerTurnEnd.forEach(script =>
      {
        script(this);
      });
    }

    this.processPlayerEndTurn(this.playerToAct);

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

    if (this.playerToAct.isIndependent)
    {
      this.endTurn();

      return;
    }

    eventManager.dispatchEvent("endTurn", null);
    eventManager.dispatchEvent("updateSelection", null);

    if (this.playerToAct.isAi)
    {
      this.playerToAct.aiController.processTurn(this.endTurn.bind(this));
    }
  }
  public getSaveData(name: string): string
  {
    const gameData = this.serialize();

    const fullSaveData: FullSaveData =
    {
      name: name,
      date: new Date().toISOString(),
      appVersion: app.version,
      gameData: gameData,
      idGenerators: idGenerators.serialize(),
      cameraLocation: app.renderer && app.renderer.camera ?
        app.renderer.camera.getCenterPosition() :
        undefined,
      moduleData: activeModuleData.serialize(),
    };

    return JSON.stringify(fullSaveData);
  }
  public save(name: string, wasManuallyTriggered: boolean = true): Promise<string>
  {
    const saveData = this.getSaveData(name);

    const saveString = storageStrings.savePrefix + name;

    if (wasManuallyTriggered)
    {
      this.gameStorageKey = saveString;
    }

    return localForage.setItem(saveString, saveData);
  }
  public getLiveMajorPlayers(): Player[]
  {
    return this.players.filter(player =>
    {
      return !player.isDead && !player.isIndependent;
    });
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
      unit.offensiveBattlesFoughtThisTurn = 0;
    });

    if (!player.isIndependent)
    {
      player.money += player.getIncome();

      const allResourceIncomeData = player.getResourceIncome();
      for (const resourceType in allResourceIncomeData)
      {
        const resourceData = allResourceIncomeData[resourceType];
        player.addResource(resourceData.resource, resourceData.amount);
      }

      player.playerTechnology.allocateResearchPoints(player.getResearchSpeed());
    }
  }
  private processPlayerEndTurn(player: Player): void
  {
    if (!player.isIndependent)
    {
      player.getAllManufactories().forEach(manufactory =>
      {
        manufactory.buildAllThings();
      });
    }
  }
  // after each player has has a go
  private processNewRoundOfPlayStart(): void
  {
    this.turnNumber++;
    activeNotificationStore.currentTurn = this.turnNumber;
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
      notificationStore: activeNotificationStore.serialize(),
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
