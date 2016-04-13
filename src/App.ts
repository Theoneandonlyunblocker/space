import GalaxyMap from "./GalaxyMap.ts";
import Game from "./Game.ts";
import GameLoader from "./GameLoader.ts";
import idGenerators from "./idGenerators.ts";
import MapRenderer from "./MapRenderer.ts";
import ModuleData from "./ModuleData.ts";
import ModuleLoader from "./ModuleLoader.ts";
import NotificationLog from "./NotificationLog.ts";
import Player from "./Player.ts";
import PlayerControl from "./PlayerControl.ts";
import ReactUI from "./ReactUI.ts";
import Renderer from "./Renderer.ts";
import setDynamicTemplateProperties from "./setDynamicTemplateProperties.ts";
import Options from "./options.ts";
import {loadTutorialStatus} from "./tutorials/TutorialStatus.ts";
import
{
  extendObject,
  onDOMLoaded
} from "./utility.ts";

import MapGenOptionValues from "./templateinterfaces/MapGenOptionValues.d.ts";

import defaultEmblems from "../modules/defaultemblems/defaultEmblems.ts";
import defaultRuleset from "../modules/defaultruleset/defaultRuleset.ts";
import defaultAI from "../modules/defaultai/defaultAI.ts";
import defaultItems from "../modules/defaultitems/defaultItems.ts";
import defaultTechnologies from "../modules/defaulttechnologies/defaultTechnologies.ts";
import defaultAttitudemodifiers from "../modules/defaultattitudemodifiers/defaultAttitudemodifiers.ts";
import defaultMapgen from "../modules/defaultmapgen/defaultMapgen.ts";
import defaultUnits from "../modules/defaultunits/defaultUnits.ts";
import defaultBackgrounds from "../modules/defaultbackgrounds/defaultBackgrounds.ts";
import defaultMapmodes from "../modules/defaultmapmodes/defaultMapmodes.ts";
import paintingPortraits from "../modules/paintingportraits/paintingPortraits.ts";
import defaultBuildings from "../modules/defaultbuildings/defaultBuildings.ts";
import defaultNotifications from "../modules/defaultnotifications/defaultNotifications.ts";

const app = new App();
export default app;

class App
{
  seed: string;
  renderer: Renderer;
  game: Game;
  mapRenderer: MapRenderer;
  reactUI: ReactUI;
  humanPlayer: Player;
  playerControl: PlayerControl;
  images:
  {
    [id: string]: HTMLImageElement;
  } = {};

  moduleData: ModuleData;
  moduleLoader: ModuleLoader;

  constructor()
  {
    var self = this;
    PIXI.utils._saidHello = true;

    this.seed = "" + Math.random();
    Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));

    var boundMakeApp = this.makeApp.bind(this);
    onDOMLoaded(function()
    {
      var moduleLoader = self.moduleLoader = new ModuleLoader();
      self.moduleData = moduleLoader.moduleData;
      
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
      
      moduleLoader.loadAll(boundMakeApp);
    });
  }
  makeApp()
  {
    var startTime = Date.now();

    Options.load();
    loadTutorialStatus();

    setDynamicTemplateProperties();
    
    this.initUI();
    this.setInitialScene();

    if (this.reactUI.currentScene === "galaxyMap")
    {
      this.game = this.makeGame();
      this.initGame();

      this.initDisplay();
      this.hookUI();
    }

    this.reactUI.render();

    console.log("Init in " + (Date.now() - startTime) + " ms");
  }
  destroy()
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
  load(saveKey: string)
  {
    var data = localStorage.getItem(saveKey);
    if (!data) return;

    var parsed = JSON.parse(data);

    idGenerators.setValues(parsed.idGenerators);

    this.destroy();

    this.initUI();

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
  }
  makeGameFromSetup(map: GalaxyMap, players: Player[])
  {
    this.destroy();

    this.initUI();

    this.game = new Game(map, players, players[0]);
    this.initGame();

    this.initDisplay();
    this.hookUI();

    this.reactUI.switchScene("galaxyMap");
  }
  makeGame()
  {
    var playerData = this.makePlayers();
    var players = playerData.players;
    var map = this.makeMap(playerData);

    var game = new Game(map, players, players[0]);

    return game;
  }

  makePlayers()
  {
    var players: Player[] = [];

    for (var i = 0; i < 5; i++)
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
  makeMap(playerData: {players: Player[]})
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
  initGame()
  {
    if (!this.game) throw new Error("App tried to init game without " +
      "having one specified");

    this.humanPlayer = this.game.humanPlayer;
    this.humanPlayer.isAI = false;

    if (this.playerControl) this.playerControl.removeEventListeners();

    this.playerControl = new PlayerControl(this.humanPlayer);

    for (var i = 0; i < this.game.playerOrder.length; i++)
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
  initDisplay()
  {
    this.renderer = new Renderer(this.game.galaxyMap);
    this.renderer.init();

    this.mapRenderer = new MapRenderer(this.game.galaxyMap, this.humanPlayer);
    this.mapRenderer.setParent(this.renderer.layers["map"]);
    this.mapRenderer.init();

    // some initialization is done when the react component owning the
    // renderer mounts, such as in uicomponents/galaxymap/galaxymap.ts
  }
  initUI()
  {
    this.reactUI = new ReactUI(
      document.getElementById("react-container"));
  }
  hookUI()
  {
    this.reactUI.game = this.game;
    this.reactUI.player = this.humanPlayer;
    this.reactUI.playerControl = this.playerControl;
    this.reactUI.renderer = this.renderer;
    this.reactUI.mapRenderer = this.mapRenderer;
  }
  setInitialScene()
  {
    var uriParser = document.createElement("a");
    uriParser.href = document.URL;
    var hash = uriParser.hash;

    if (hash)
    {
      this.reactUI.currentScene = hash.slice(1);
    }
    else
    {
      this.reactUI.currentScene = "setupGame";
    }
  }
}

