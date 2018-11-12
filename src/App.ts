/// <reference path="../lib/rng.d.ts" />

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
import {defaultModuleData} from "./defaultModuleData";
import idGenerators from "./idGenerators";
import {handleError} from "./handleError";
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
  getMatchingLocalStorageKeys,
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
  // TODO refactor | most (all?) of these should be private or moved
  public renderer: Renderer;
  public game: Game;
  public playerControl: PlayerControl;
  public reactUI: ReactUI;
  public images:
  {
    [id: string]: HTMLImageElement;
  } = {};

  public readonly version: string = "0.1.0";

  private seed: string;
  private mapRenderer: MapRenderer;
  private moduleInitializer: ModuleInitializer;

  constructor()
  {
    PIXI.utils.skipHello();
    window.onhashchange = () =>
    {
      this.destroy();
      this.initUI();
      this.makeApp();
    };

    this.cleanUpLocalStorageKeys();

    this.seed = "" + Math.random();
    Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));
    window.onerror = handleError;

    this.moduleInitializer = new ModuleInitializer(activeModuleData);
    this.initUI();

    onDOMLoaded(() =>
    {
      defaultModuleData.moduleFiles.forEach(moduleFile =>
      {
        this.moduleInitializer.addModuleFile(moduleFile);
      });

      addCommonToModuleData(activeModuleData);

      // some things called in this.makeApp() rely on global app variable
      // this timeout allows constructor to finish and variable to be assigned
      window.setTimeout(() =>
      {
        this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.AppInit, () =>
        {
          this.makeApp();
        });
      }, 0);
    });
  }

  public makeGameFromSetup(map: GalaxyMap, players: Player[])
  {
    this.destroy();

    this.initUI();

    this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.GameStart, () =>
    {
      this.game = new Game(map, players);
      this.initGame();

      this.initDisplay();
      this.hookUI();
      centerCameraOnPosition(activePlayer.controlledLocations[0]);

      this.reactUI.switchScene("galaxyMap");
    });
  }
  public load(saveKey: string)
  {
    const rawData = localStorage.getItem(saveKey);
    if (!rawData)
    {
      throw new Error(`Couldn't fetch save data with key ${saveKey}`);
    }

    const parsedData: FullSaveData = JSON.parse(rawData);
    const data = reviveSaveData(parsedData, this.version);

    idGenerators.setValues(data.idGenerators);

    this.destroy();
    this.initUI();

    this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.GameStart, () =>
    {
      this.game = new GameLoader().deserializeGame(data.gameData);
      this.game.gameStorageKey = saveKey;
      this.initGame();

      this.initDisplay();
      this.hookUI();
      if (data.cameraLocation)
      {
        centerCameraOnPosition(data.cameraLocation);
      }

      this.reactUI.switchScene("galaxyMap");
    });

  }

  private makeApp()
  {
    const startTime = Date.now();

    Options.load();
    TutorialStatus.load();

    // don't preload modules in debug mode to ensure loading phases work correctly
    if (!Options.debug.enabled)
    {
      this.moduleInitializer.progressivelyInitModulesByPhase(0);
    }

    const initialScene = this.getInitialScene();

    const switchSceneFN = () =>
    {
      this.reactUI.switchScene(initialScene);

      console.log(`Init app in ${Date.now() - startTime}ms`);
    };

    if (initialScene === "galaxyMap")
    {
      this.moduleInitializer.initModulesNeededForPhase(ModuleFileInitializationPhase.GameStart, () =>
      {
        this.game = this.makeGame();
        this.initGame();

        this.initDisplay();
        this.hookUI();
        centerCameraOnPosition(activePlayer.controlledLocations[0]);

        switchSceneFN();
      });
    }
    else
    {
      switchSceneFN();
    }
  }
  private destroy()
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
  private makeGame()
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
  private makeMap(playerData: {players: Player[]})
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
  private initGame()
  {
    if (!this.game)
    {
      throw new Error("App tried to init game without having one specified");
    }

    if (!activeNotificationStore)
    {
      setActiveNotificationStore(new NotificationStore());
      activeNotificationStore.currentTurn = this.game.turnNumber;
    }

    setActivePlayer(this.game.players[0]);
    activePlayer.isAi = false;

    if (this.playerControl)
    {
      this.playerControl.removeEventListeners();
    }

    this.playerControl = new PlayerControl(activePlayer);

    this.game.players.forEach(player =>
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
        player.aiController = player.makeRandomAiController(this.game);
      }
    });

    activeModuleData.scripts.game.afterInit.forEach(script =>
    {
      script(this.game);
    });
  }
  private initDisplay()
  {
    this.renderer = new Renderer(
      this.game.galaxyMap.seed,
      activeModuleData.mapBackgroundDrawingFunction,
    );

    this.mapRenderer = new MapRenderer(this.game.galaxyMap, activePlayer);
    this.mapRenderer.setParent(this.renderer.layers.map);
    this.mapRenderer.init();

    // some initialization is done when the react component owning the
    // renderer mounts, such as in uicomponents/galaxymap/galaxymap.ts
  }
  private initUI()
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
  private hookUI()
  {
    this.reactUI.game = this.game;
    this.reactUI.player = activePlayer;
    this.reactUI.playerControl = this.playerControl;
    this.reactUI.renderer = this.renderer;
    this.reactUI.mapRenderer = this.mapRenderer;
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
  private cleanUpLocalStorageKeys(): void
  {
    const reviversByAppVersion: ReviversByVersion =
    {
      "0.0.0":
      [
        () =>
        {
          localStorage.removeItem(storageStrings.deprecated_language);
        },
        () =>
        {
          const notificationFilterOptionsToDelete = getMatchingLocalStorageKeys(/^NotificationFilter\./);
          notificationFilterOptionsToDelete.forEach(storageKey =>
          {
            localStorage.removeItem(storageKey);
          });
        },
      ],
    };

    const reviversToExecute = fetchNeededReviversForData(
      "",
      this.version,
      reviversByAppVersion,
    );

    reviversToExecute.forEach(reviverFN =>
    {
      reviverFN();
    });
  }
}

const app = new App();
export default app;

