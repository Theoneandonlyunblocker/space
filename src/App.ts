/// <reference path="../lib/rng.d.ts" />
import * as localForage from "localforage";

import addCommonToModuleData from "../modules/common/addCommonToModuleData";

import GalaxyMap from "./GalaxyMap";
import Game from "./Game";
import GameLoader from "./GameLoader";
import MapRenderer from "./MapRenderer";
import ModuleFileInitializationPhase from "./ModuleFileInitializationPhase";
import ModuleInitializer from "./ModuleInitializer";
import Options from "./Options";
import Player from "./Player";
import PlayerControl from "./PlayerControl";
import ReactUI from "./ReactUI";
import ReactUIScene from "./ReactUIScene";
import Renderer from "./Renderer";
import {activeModuleData} from "./activeModuleData";
import {activePlayer, setActivePlayer} from "./activePlayer";
import {centerCameraOnPosition} from "./centerCameraOnPosition";
import {defaultModules} from "./defaultModules";
import idGenerators from "./idGenerators";
import {handleError} from "./handleError";
import {activeModuleStore} from "./ModuleStore";
import {activeNotificationFilter} from "./notifications/NotificationFilter";
import * as debug from "./debug";
import
{
  reviveSaveData,
  ReviversByVersion,
  fetchNeededReviversForData,
} from "./reviveSaveData";
import
{
  getRandomArrayItem,
  onDOMLoaded,
  getFunctionName,
} from "./utility";

import {NotificationStore} from "./notifications/NotificationStore";
import {activeNotificationStore, setActiveNotificationStore} from "./notifications/activeNotificationStore";
import TutorialStatus from "./tutorials/TutorialStatus";
import MapGenOptionValues from "./templateinterfaces/MapGenOptionValues";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import FullSaveData from "./savedata/FullSaveData";
import { PlayerNotificationSubscriber } from "./notifications/PlayerNotificationSubscriber";
import { storageStrings } from "./storageStrings";


class App
{
  public renderer: Renderer;
  public game: Game;
  public playerControl: PlayerControl;
  public reactUI: ReactUI;
  public moduleInitializer: ModuleInitializer;
  public images:
  {
    [id: string]: HTMLImageElement;
  } = {};

  public readonly version: string = "0.2.0";

  private seed: string;
  private mapRenderer: MapRenderer;

  constructor()
  {
    PIXI.utils.skipHello();

    this.cleanUpStorage();

    window.onhashchange = () =>
    {
      this.destroy();
      this.initUI();
      this.makeApp();
    };

    this.seed = "" + Math.random();
    Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));
    window.onerror = handleError;

    this.moduleInitializer = new ModuleInitializer(activeModuleData);

    this.initUI();

    onDOMLoaded(() =>
    {
      debug.log("init", "DOM loaded");

      defaultModules.forEach(moduleFile =>
      {
        activeModuleStore.add(moduleFile);
        this.moduleInitializer.addModuleFile(moduleFile);
      });

      addCommonToModuleData(activeModuleData);

      // some things called in this.makeApp() rely on global app variable
      // this timeout allows constructor to finish and variable to be assigned
      // still necessary with promise, as Promise.all may be synchronous
      window.setTimeout(() =>
      {
        return this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.AppInit).then(() =>
        {
          return Promise.all(
          [
            Options.load(),
            TutorialStatus.load(),
          ]);
        }).then(() =>
        {
          debug.log("init", "Finish loading data needed to init app");

          this.makeApp();
        });
      }, 0);
    });
  }

  public makeGameFromSetup(map: GalaxyMap, players: Player[])
  {
    this.destroy();

    this.initUI();

    this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.GameStart).then(() =>
    {
      this.initGame(new Game(map, players)).then(() =>
      {
        this.reactUI.switchScene("galaxyMap");
      });

    });
  }
  public load(saveKey: string): Promise<void>
  {
    return localForage.getItem<string>(saveKey).then(rawData =>
    {
      if (!rawData)
      {
        throw new Error(`Couldn't fetch save data with key ${saveKey}`);
      }

      const parsedData: FullSaveData = JSON.parse(rawData);
      reviveSaveData(parsedData, this.version).then(data =>
      {
        idGenerators.setValues(data.idGenerators);

        this.destroy();
        this.initUI();

        this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.GameStart).then(() =>
        {
          const game = new GameLoader().deserializeGame(data.gameData);
          game.gameStorageKey = saveKey;

          this.initGame(game, data.cameraLocation).then(() =>
          {
            this.reactUI.switchScene("galaxyMap");
          });

        });
      });
    });
  }

  private makeApp(): void
  {
    const startTime = Date.now();

    this.moduleInitializer.progressivelyInitModulesByPhase(ModuleFileInitializationPhase.AppInit + 1);

    const initialScene = this.getInitialScene();

    const finalizeMakingApp = () =>
    {
      this.reactUI.switchScene(initialScene);

      debug.log("init", `Init app in ${Date.now() - startTime}ms`);
    };

    if (initialScene === "galaxyMap")
    {
      this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.GameStart).then(() =>
      {
        this.initGame(this.makeGame()).then(() =>
        {
          finalizeMakingApp();
        });

      });
    }
    else
    {
      finalizeMakingApp();
    }
  }
  private destroy(): void
  {
    if (this.game)
    {
      this.game.destroy();
      this.game = null;
    }

    if (this.mapRenderer)
    {
      this.mapRenderer.destroy();
      this.mapRenderer = null;
    }

    if (this.renderer)
    {
      this.renderer.destroy();
      this.renderer = null;
    }

    if (this.playerControl)
    {
      this.playerControl.destroy();
      this.playerControl = null;
    }

    if (this.reactUI)
    {
      this.reactUI.destroy();
      this.reactUI = null;
    }
  }
  private initUI(): void
  {
    const reactContainer = document.getElementById("react-container");

    if (!reactContainer)
    {
      throw new Error("Couldn't get react container");
    }

    this.reactUI = new ReactUI(
      reactContainer,
      this.moduleInitializer,
    );
  }
  private initGame(game: Game, initialCameraPosition?: Point): Promise<void>
  {
    this.game = game;

    if (!activeNotificationStore)
    {
      setActiveNotificationStore(new NotificationStore());
      activeNotificationStore.currentTurn = game.turnNumber;
    }

    setActivePlayer(game.players[0]);
    activePlayer.isAi = false;

    if (this.playerControl)
    {
      this.playerControl.removeEventListeners();
    }

    this.playerControl = new PlayerControl(activePlayer);

    game.players.forEach(player =>
    {
      if (!player.isIndependent)
      {
        if (!player.notificationLog)
        {
          player.notificationLog = new PlayerNotificationSubscriber(player);
        }
        player.notificationLog.registerToNotificationStore(activeNotificationStore);
      }

      if (!player.aiController)
      {
        player.aiController = player.makeRandomAiController(game);
      }
    });

    // notification filter is loaded here as it's dependant on notifications having been loaded
    return activeNotificationFilter.load().then(() =>
    {
      activeModuleData.scripts.game.afterInit.forEach(script =>
      {
        script(game);
      });

      this.initDisplay(game, activePlayer);
      this.hookUI(
        game,
        activePlayer,
        this.playerControl,
        this.renderer,
        this.mapRenderer,
      );

      const pointToCenterCameraOn = initialCameraPosition || activePlayer.controlledLocations[0];
      centerCameraOnPosition(pointToCenterCameraOn);
    });
  }
  private initDisplay(game: Game, player: Player): void
  {
    this.renderer = new Renderer(
      game.galaxyMap.seed,
      activeModuleData.mapBackgroundDrawingFunction,
    );

    this.mapRenderer = new MapRenderer(game.galaxyMap, player);
    this.mapRenderer.setParent(this.renderer.layers.map);
    this.mapRenderer.init();

    // some initialization is done when the react component owning the
    // renderer mounts, such as in uicomponents/galaxymap/galaxymap.ts
  }
  private hookUI(
    game: Game,
    player: Player,
    playerControl: PlayerControl,
    renderer: Renderer,
    mapRenderer: MapRenderer,
  ): void
  {
    this.reactUI.game = game;
    this.reactUI.player = player;
    this.reactUI.playerControl = playerControl;
    this.reactUI.renderer = renderer;
    this.reactUI.mapRenderer = mapRenderer;
  }
  private getInitialScene(): ReactUIScene
  {
    const urlParser = document.createElement("a");
    urlParser.href = document.URL;
    const hash = urlParser.hash;

    if (hash)
    {
      return <ReactUIScene> hash.slice(1);
    }
    else
    {
      return "setupGame";
    }
  }
  private makeGame(): Game
  {
    const playerData = this.makePlayers();
    const players = playerData.players;
    const map = this.makeMap(playerData);

    const game = new Game(map, players);

    return game;
  }
  private makePlayers()
  {
    const players: Player[] = [];
    const candidateRaces = <RaceTemplate[]> Object.keys(activeModuleData.templates.Races).map(raceKey =>
    {
      return activeModuleData.templates.Races[raceKey];
    }).filter(raceTemplate =>
    {
      return !raceTemplate.isNotPlayable;
    });

    for (let i = 0; i < 5; i++)
    {
      players.push(new Player(
      {
        isAi: i > 0,
        isIndependent: false,

        race: getRandomArrayItem(candidateRaces),
        money: 1000,
      }));
    }

    return(
    {
      players: players,
    });
  }
  private makeMap(playerData: {players: Player[]}): GalaxyMap
  {
    const optionValues: MapGenOptionValues =
    {
      defaultOptions:
      {
        height: 1200,
        width: 1200,
        starCount: 30,
      },
      basicOptions:
      {
        arms: 5,
        centerDensity: 40,
        starSizeRegularity: 100,
      },
    };

    const mapGenResult = activeModuleData.getDefaultMap().mapGenFunction(
      optionValues,
      playerData.players,
    );

    const galaxyMap = mapGenResult.makeMap();

    return galaxyMap;
  }
  private cleanUpStorage(): void
  {
    localForage.getItem<string>(storageStrings.appVersion).then(storedAppVersion =>
    {
      const reviversByAppVersion: ReviversByVersion =
      {
        "0.0.0":
        [
          function removeSeparatelyStoredLanguageSetting()
          {
            localStorage.removeItem(storageStrings.deprecated_language);
          },
        ],
        "0.1.0":
        [
          function onlyUseOneSlotForStoredOptions()
          {
            const storedOptions = localStorage.getItem(storageStrings.deprecated_options);
            localStorage.setItem(storageStrings.options, storedOptions);
            localStorage.removeItem(storageStrings.deprecated_options);
          },
          function onlyUseOneSlotForStoredNotificationFilterSettings()
          {
            const storedNotificationFilter = localStorage.getItem(storageStrings.deprecated_notificationFilter);
            localStorage.setItem(storageStrings.notificationFilter, storedNotificationFilter);
            localStorage.removeItem(storageStrings.deprecated_notificationFilter);
          },
          function moveStoredDataFromLocalStorageToLocalForage()
          {
            Object.keys(localStorage).filter(key => key.indexOf(storageStrings.basePrefix) !== -1).forEach(key =>
            {
              localForage.setItem(key, localStorage.getItem(key)).then(() =>
              {
                localStorage.removeItem(key);
              });
            });
          }
        ]
      };

      const reviversToExecute = fetchNeededReviversForData(
        storedAppVersion || "",
        this.version,
        reviversByAppVersion,
      );

      reviversToExecute.forEach(reviverFN =>
      {
        debug.log("saves", `Cleaning up outdated stored data with function '${getFunctionName(reviverFN)}'`);
        reviverFN();
      });

      localForage.setItem(storageStrings.appVersion, this.version);
    });
  }
}

const app = new App();
export default app;

