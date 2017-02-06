/// <reference path="../lib/rng.d.ts" />

import GalaxyMap from "./GalaxyMap";
import Game from "./Game";
import GameLoader from "./GameLoader";
import MapRenderer from "./MapRenderer";
import ModuleData from "./ModuleData";
import ModuleFileLoadingPhase from "./ModuleFileLoadingPhase";
import ModuleLoader from "./ModuleLoader";
import NotificationLog from "./NotificationLog";
import Options from "./Options";
import Player from "./Player";
import PlayerControl from "./PlayerControl";
import ReactUI from "./ReactUI";
import ReactUIScene from "./ReactUIScene";
import Renderer from "./Renderer";
import idGenerators from "./idGenerators";
import TutorialStatus from "./tutorials/TutorialStatus";
import
{
  getRandomArrayItem,
  onDOMLoaded,
} from "./utility";

import MapGenOptionValues from "./templateinterfaces/MapGenOptionValues";
import {PlayerRaceTemplate} from "./templateinterfaces/PlayerRaceTemplate";

import addCommonToModuleData from "../modules/common/addCommonToModuleData";

import defaultAI from "../modules/defaultai/defaultAI";
import defaultAttitudemodifiers from "../modules/defaultattitudemodifiers/defaultAttitudemodifiers";
import defaultBackgrounds from "../modules/defaultbackgrounds/defaultBackgrounds";
import defaultBuildings from "../modules/defaultbuildings/defaultBuildings";
import defaultEmblems from "../modules/defaultemblems/defaultEmblems";
import defaultItems from "../modules/defaultitems/defaultItems";
import defaultMapgen from "../modules/defaultmapgen/defaultMapgen";
import defaultMapmodes from "../modules/defaultmapmodes/defaultMapmodes";
import defaultNotifications from "../modules/defaultnotifications/defaultNotifications";
import defaultRaces from "../modules/defaultraces/defaultRaces";
import defaultRuleset from "../modules/defaultruleset/defaultRuleset";
import defaultTechnologies from "../modules/defaulttechnologies/defaultTechnologies";
import defaultUnits from "../modules/defaultunits/defaultUnits";

import paintingPortraits from "../modules/paintingportraits/paintingPortraits";

import {drones} from "../modules/drones/moduleFile";

class App
{
  // TODO refactor | most (all?) of these should be private or moved
  public renderer: Renderer;
  public game: Game;
  public moduleData: ModuleData;
  public humanPlayer: Player;
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

    const moduleLoader = this.moduleLoader = new ModuleLoader();
    this.initUI();

    onDOMLoaded(() =>
    {
      this.moduleData = moduleLoader.moduleData;

      moduleLoader.addModuleFile(defaultEmblems);
      moduleLoader.addModuleFile(defaultRuleset);
      moduleLoader.addModuleFile(defaultAI);
      moduleLoader.addModuleFile(defaultItems);
      moduleLoader.addModuleFile(defaultTechnologies);
      moduleLoader.addModuleFile(defaultAttitudemodifiers);
      moduleLoader.addModuleFile(defaultMapgen);
      moduleLoader.addModuleFile(defaultUnits);
      moduleLoader.addModuleFile(defaultBackgrounds);
      moduleLoader.addModuleFile(defaultMapmodes);
      moduleLoader.addModuleFile(paintingPortraits);
      moduleLoader.addModuleFile(defaultBuildings);
      moduleLoader.addModuleFile(defaultNotifications);
      moduleLoader.addModuleFile(defaultRaces);
      moduleLoader.addModuleFile(drones);

      addCommonToModuleData(moduleLoader.moduleData);

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
      this.game = new Game(map, players, players[0]);
      this.initGame();

      this.initDisplay();
      this.hookUI();

      this.reactUI.switchScene("galaxyMap");
    });
  }
  public load(saveKey: string)
  {
    var data = localStorage.getItem(saveKey);
    if (!data)
    {
      return;
    }

    var parsed = JSON.parse(data);

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
    var startTime = Date.now();

    Options.load();
    TutorialStatus.load();

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
    }

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
    var playerData = this.makePlayers();
    var players = playerData.players;
    var map = this.makeMap(playerData);

    var game = new Game(map, players, players[0]);

    return game;
  }
  private makePlayers()
  {
    var players: Player[] = [];
    const candidateRaces = <PlayerRaceTemplate[]> Object.keys(this.moduleData.Templates.Races).map(raceKey =>
    {
      return this.moduleData.Templates.Races[raceKey];
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
    var optionValues: MapGenOptionValues =
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
    }

    var mapGenResult = this.moduleData.getDefaultMap().mapGenFunction(
      optionValues,
      playerData.players,
    );

    var galaxyMap = mapGenResult.makeMap();
    return galaxyMap;
  }
  private initGame()
  {
    if (!this.game)
    {
      throw new Error("App tried to init game without having one specified");
    }

    this.humanPlayer = this.game.humanPlayer;
    this.humanPlayer.isAI = false;

    if (this.playerControl)
    {
      this.playerControl.removeEventListeners();
    }

    this.playerControl = new PlayerControl(this.humanPlayer);

    if (!this.game.notificationLog)
    {
      this.game.notificationLog = new NotificationLog(this.humanPlayer);
      this.game.notificationLog.setTurn(this.game.turnNumber, true);
    }

    app.moduleData.scripts.game.afterInit.forEach(scriptFN =>
    {
      scriptFN(this.game);
    });

    this.game.playerOrder.forEach(player =>
    {
      if (player.isAI && !player.AIController)
      {
        player.AIController = player.makeRandomAIController(this.game);
      }
    });
  }
  private initDisplay()
  {
    this.renderer = new Renderer(
      this.game.galaxyMap.seed,
      this.moduleData.mapBackgroundDrawingFunction,
    );
    this.renderer.init();

    this.mapRenderer = new MapRenderer(this.game.galaxyMap, this.humanPlayer);
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
    this.reactUI.player = this.humanPlayer;
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
}

const app = new App();
export default app;

