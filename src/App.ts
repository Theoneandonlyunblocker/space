/// <reference path="../lib/rng.d.ts" />

import GalaxyMap from "./GalaxyMap";
import Game from "./Game";
import GameLoader from "./GameLoader";
import idGenerators from "./idGenerators";
import MapRenderer from "./MapRenderer";
import ModuleData from "./ModuleData";
import ModuleLoader from "./ModuleLoader";
import ModuleFileLoadingPhase from "./ModuleFileLoadingPhase";
import NotificationLog from "./NotificationLog";
import Player from "./Player";
import PlayerControl from "./PlayerControl";
import ReactUI from "./ReactUI";
import ReactUIScene from "./ReactUIScene";
import Renderer from "./Renderer";
import Options from "./options";
import TutorialStatus from "./tutorials/TutorialStatus";
import
{
  extendObject,
  onDOMLoaded
} from "./utility";

import MapGenOptionValues from "./templateinterfaces/MapGenOptionValues";

import copyCommonTemplates from "../modules/common/copyCommonTemplates";
import defaultEmblems from "../modules/defaultemblems/defaultEmblems";
import defaultRuleset from "../modules/defaultruleset/defaultRuleset";
import defaultAI from "../modules/defaultai/defaultAI";
import defaultItems from "../modules/defaultitems/defaultItems";
import defaultTechnologies from "../modules/defaulttechnologies/defaultTechnologies";
import defaultAttitudemodifiers from "../modules/defaultattitudemodifiers/defaultAttitudemodifiers";
import defaultMapgen from "../modules/defaultmapgen/defaultMapgen";
import defaultUnits from "../modules/defaultunits/defaultUnits";
import defaultBackgrounds from "../modules/defaultbackgrounds/defaultBackgrounds";
import defaultMapmodes from "../modules/defaultmapmodes/defaultMapmodes";
import paintingPortraits from "../modules/paintingportraits/paintingPortraits";
import defaultBuildings from "../modules/defaultbuildings/defaultBuildings";
import defaultNotifications from "../modules/defaultnotifications/defaultNotifications";

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
    PIXI.utils._saidHello = true;

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
      
      copyCommonTemplates(moduleLoader.moduleData);
      
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
    if (!data) return;

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

    for (let i = 0; i < 5; i++)
    {
      var player = new Player(i >= 1);
      player.makeRandomFlag();
      player.initTechnologies();

      players.push(player);
    }

    return(
    {
      players: players
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
        starCount: 30
      },
      basicOptions:
      {
        arms: 5,
        centerDensity: 40,
        starSizeRegularity: 100
      }
    }

    var mapGenResult = this.moduleData.getDefaultMap().mapGenFunction(
      optionValues,
      playerData.players
    );

    var galaxyMap = mapGenResult.makeMap();
    return galaxyMap;
  }
  private initGame()
  {
    if (!this.game) throw new Error("App tried to init game without " +
      "having one specified");

    this.humanPlayer = this.game.humanPlayer;
    this.humanPlayer.isAI = false;

    if (this.playerControl) this.playerControl.removeEventListeners();

    this.playerControl = new PlayerControl(this.humanPlayer);

    for (let i = 0; i < this.game.playerOrder.length; i++)
    {
      var player = this.game.playerOrder[i];
      if (player.isAI)
      {
        player.setupAI(this.game);
      }
    }

    if (!this.game.notificationLog)
    {
      this.game.notificationLog = new NotificationLog(this.humanPlayer);
      this.game.notificationLog.setTurn(this.game.turnNumber, true);
    }
  }
  private initDisplay()
  {
    this.renderer = new Renderer(
      this.game.galaxyMap.seed, 
      this.moduleData.mapBackgroundDrawingFunction
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
      this.moduleLoader
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

