import * as localForage from "localforage";

import {app} from "../app/App"; // TODO global
import {GalaxyMap} from "../map/GalaxyMap";
import {Player} from "../player/Player";
import {PlayerDiplomacy} from "../diplomacy/PlayerDiplomacy";
import {activePlayer} from "../app/activePlayer";
import {eventManager} from "../app/eventManager";
import {idGenerators} from "../app/idGenerators";
import {activeNotificationStore} from "../app/activeNotificationStore";

import {FullSaveData} from "../savedata/FullSaveData";
import {GameSaveData} from "../savedata/GameSaveData";
import { activeModuleData } from "../app/activeModuleData";
import { storageStrings } from "../saves/storageStrings";
import { GlobalModifiersCollection } from "../maplevelmodifiers/GlobalModifiersCollection";
import { Unit } from "../unit/Unit";
import { Building } from "../building/Building";
import { flatten2dArray } from "../generic/utility";
import { Item } from "../items/Item";


export class Game
{
  public turnNumber: number;
  public readonly players: Player[] = [];
  public readonly galaxyMap: GalaxyMap;
  public hasEnded: boolean = false;
  public playerToAct: Player;
  public gameStorageKey: string;
  public globalModifiers: GlobalModifiersCollection = new GlobalModifiersCollection(this);

  private actingPlayerIndex: number = 0;

  constructor(props:
  {
    map: GalaxyMap;
    players: Player[];
    turnNumber?: number;
  })
  {
    this.galaxyMap = props.map;
    this.players = [...props.players];

    this.turnNumber = isFinite(props.turnNumber) ? props.turnNumber : 1;

    this.playerToAct = this.players[0];

    // TODO 2017.07.24 | this seems kinda weird
    if (this.galaxyMap.independents)
    {
      this.players.push(...this.galaxyMap.independents);
      this.galaxyMap.independents = null;
      delete this.galaxyMap.independents;
    }

    this.players.filter(player =>
    {
      return !player.isIndependent && !player.isDead;
    }).forEach(player =>
    {
      player.diplomacy = new PlayerDiplomacy(player, this);
    });
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
      activeModuleData.scripts.call("beforePlayerTurnEnd", this);
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
  public getAllUnits(): Unit[]
  {
    return flatten2dArray(this.players.map(player => player.units));
  }
  public getAllBuildings(): Building[]
  {
    return flatten2dArray(this.players.map(player => player.getAllOwnedBuildings()));
  }
  public getAllItems(): Item[]
  {
    return flatten2dArray(this.players.map(player => player.items));
  }
  // unit modifiers can depend on stars which can depend on units etc.
  // so this has to be done after everything is already in place
  public initializeAllModifiers(): void
  {
    this.getAllUnits().forEach(unit => unit.mapLevelModifiers.handleConstruct());
    this.getAllBuildings().forEach(building => building.modifiers.handleConstruct());
    this.getAllItems().forEach(item => item.modifiers.handleConstruct());
  }

  // for every player, not just human
  private processPlayerStartTurn(player: Player)
  {
    player.units.forEach(unit =>
    {
      unit.addHealth(unit.getHealingForGameTurnStart());

      unit.resetMovePoints();
      unit.offensiveBattlesFoughtThisTurn = 0;
    });

    if (!player.isIndependent)
    {
      const resourceIncome = player.getResourceIncome();
      player.addResources(resourceIncome);

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
  // after each player has had a go
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
