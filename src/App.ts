/// <reference path="../lib/rng.d.ts" />

import GalaxyMap from "./GalaxyMap";
import Game from "./Game";
import GameLoader from "./GameLoader";
import MapRenderer from "./MapRenderer";
import ModuleFileLoadingPhase from "./ModuleFileLoadingPhase";
import ModuleLoader from "./ModuleLoader";
import NotificationLog from "./NotificationLog";
import Options from "./Options";
import Player from "./Player";
import PlayerControl from "./PlayerControl";
import ReactUI from "./ReactUI";
import ReactUIScene from "./ReactUIScene";
import Renderer from "./Renderer";
import {activeModuleData} from "./activeModuleData";
import {activeNotificationLog, setActiveNotificationLog} from "./activeNotificationLog";
import {activePlayer, setActivePlayer} from "./activePlayer";
import {defaultModuleData} from "./defaultModuleData";
import idGenerators from "./idGenerators";
import
{
  getRandomArrayItem,
  onDOMLoaded,
} from "./utility";

import TutorialStatus from "./tutorials/TutorialStatus";

import MapGenOptionValues from "./templateinterfaces/MapGenOptionValues";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";

import FullSaveData from "./savedata/FullSaveData";

import {setActiveLanguageCode} from "./localization/activeLanguage";

import addCommonToModuleData from "../modules/common/addCommonToModuleData";

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

  private seed: string;
  private mapRenderer: MapRenderer;
  private moduleLoader: ModuleLoader;

  constructor()
  {
    PIXI.utils.skipHello();

    this.seed = "" + Math.random();
    Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));

    this.moduleLoader = new ModuleLoader(activeModuleData);
    this.initUI();

    onDOMLoaded(() =>
    {
      defaultModuleData.moduleFiles.forEach(moduleFile =>
      {
        this.moduleLoader.addModuleFile(moduleFile);
      });

      addCommonToModuleData(this.moduleLoader.moduleData);

      // some things called in this.makeApp() rely on global app variable
      // this timeout allows constructor to finish and variable to be assigned
      window.setTimeout(() =>
      {
        this.makeApp();
      }, 0);
    });
  }

  public makeGameFromSetup(map: GalaxyMap, players: Player[])
  {
    this.destroy();

    this.initUI();

    this.moduleLoader.loadModulesNeededForPhase(ModuleFileLoadingPhase.game, () =>
    {
      this.game = new Game(map, players);
      this.initGame();

      this.initDisplay();
      this.hookUI();

      this.reactUI.switchScene("galaxyMap");
    });
  }
  public load(saveKey: string)
  {
    const data = localStorage.getItem(saveKey);
    if (!data)
    {
      return;
    }

    const parsed: FullSaveData = JSON.parse(data);

    idGenerators.setValues(parsed.idGenerators);

    this.destroy();

    this.initUI();

    this.moduleLoader.loadModulesNeededForPhase(ModuleFileLoadingPhase.game, () =>
    {
      this.game = new GameLoader().deserializeGame(parsed.gameData);
      this.game.gameStorageKey = saveKey;
      this.initGame();

      this.initDisplay();
      this.hookUI();
      if (parsed.cameraLocation)
      {
        this.renderer.toCenterOn = parsed.cameraLocation;
      }

      this.reactUI.switchScene("galaxyMap");
    });

  }

  private makeApp()
  {
    const startTime = Date.now();

    Options.load();
    TutorialStatus.load();

    const initialLanguageCode = this.getInitialLanguageCode();
    setActiveLanguageCode(initialLanguageCode);

    // don't preload modules in debug mode to ensure loading phases work correctly
    if (!Options.debug.enabled)
    {
      this.moduleLoader.progressivelyLoadModulesByPhase(0);
    }

    const initialScene = this.getInitialScene();

    const switchSceneFN = () =>
    {
      this.reactUI.switchScene(initialScene);

      console.log("Init in " + (Date.now() - startTime) + " ms");
    };

    if (initialScene === "galaxyMap")
    {
      this.moduleLoader.loadModulesNeededForPhase(ModuleFileLoadingPhase.game, () =>
      {
        this.game = this.makeGame();
        this.initGame();

        this.initDisplay();
        this.hookUI();

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
    const candidateRaces = <RaceTemplate[]> Object.keys(activeModuleData.Templates.Races).map(raceKey =>
    {
      return activeModuleData.Templates.Races[raceKey];
    }).filter(raceTemplate =>
    {
      return !raceTemplate.isNotPlayable;
    });

    for (let i = 0; i < 5; i++)
    {
      players.push(new Player(
      {
        isAI: i > 0,
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

    setActivePlayer(this.game.players[0]);
    activePlayer.isAI = false;

    if (this.playerControl)
    {
      this.playerControl.removeEventListeners();
    }

    this.playerControl = new PlayerControl(activePlayer);

    if (!activeNotificationLog)
    {
      const playersToSubscribe = this.game.getLiveMajorPlayers();
      setActiveNotificationLog(new NotificationLog(playersToSubscribe));
      activeNotificationLog.currentTurn = this.game.turnNumber;
    }

    activeModuleData.scripts.game.afterInit.forEach(script =>
    {
      script(this.game);
    });

    this.game.players.forEach(player =>
    {
      if (!player.AIController)
      {
        player.AIController = player.makeRandomAIController(this.game);
      }
    });
  }
  private initDisplay()
  {
    this.renderer = new Renderer(
      this.game.galaxyMap.seed,
      activeModuleData.mapBackgroundDrawingFunction,
    );
    this.renderer.init();

    this.mapRenderer = new MapRenderer(this.game.galaxyMap, activePlayer);
    this.mapRenderer.setParent(this.renderer.layers.map);
    this.mapRenderer.init();

    // some initialization is done when the react component owning the
    // renderer mounts, such as in uicomponents/galaxymap/galaxymap.ts
  }
  private initUI()
  {
    this.reactUI = new ReactUI(
      document.getElementById("react-container"),
      this.moduleLoader,
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
  private getInitialLanguageCode(): string
  {
    const storedLanguageCode = localStorage.getItem("Rance.language");
    if (storedLanguageCode)
    {
      return storedLanguageCode;
    }
    else
    {
      return "en";
    }
  }
}

const app = new App();
export default app;

