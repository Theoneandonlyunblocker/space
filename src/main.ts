/// <reference path="reactui.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="maprenderer.ts" />
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>
/// <reference path="itemgenerator.ts" />
/// <reference path="debug.ts"/>

/// <reference path="moduledata.ts"/>
/// <reference path="moduleloader.ts" />
/// <reference path="../modules/default/defaultmodule.ts" />

/// <reference path="apploader.ts"/>
/// <reference path="gameloader.ts"/>

/// <reference path="../data/setdynamictemplateproperties.ts"/>
/// <reference path="../data/templateindexes.ts"/>

/// <reference path="../data/mapgen/builtinmaps.ts"/>

/// <reference path="../data/tutorials/uitutorial.ts"/>
/// <reference path="../data/options.ts"/>


module Rance
{
  export var idGenerators =
  {
    fleet: 0,
    item: 0,
    player: 0,
    star: 0,
    unit: 0,
    building: 0,

    objective: 0
  }

  export class App
  {
    seed: string;
    loader: AppLoader;
    renderer: Renderer;
    game: Game;
    mapRenderer: MapRenderer;
    reactUI: ReactUI;
    humanPlayer: Player;
    playerControl: PlayerControl;
    images:
    {
      [type: string]:
      {
        [id: string]: HTMLImageElement;
      }
    };
    itemGenerator: ItemGenerator;

    moduleData: ModuleData;

    constructor()
    {
      var self = this;

      this.seed = "" + Math.random();
      Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));

      this.loader = new AppLoader(function()
      {
        self.makeApp();
      });
    }
    makeApp()
    {
      var startTime = new Date().getTime();

      Options = extendObject(defaultOptions);
      loadOptions();

      var moduleLoader = new ModuleLoader();
      moduleLoader.loadModuleFile(Modules.DefaultModule.moduleFile);
      this.moduleData = moduleLoader.moduleData;

      setAllDynamicTemplateProperties();
      buildTemplateIndexes();

      this.images = this.loader.imageCache;
      this.itemGenerator = new ItemGenerator();

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

      console.log("Init in " + (new Date().getTime() - startTime) + " ms");
    }
    destroy()
    {
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

      idGenerators = extendObject(parsed.idGenerators);


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

    makeGameFromSetup(map: GalaxyMap, players: Player[], independents: Player[])
    {
      this.destroy();

      this.initUI();

      this.game = new Game(map, players, players[0]);
      this.game.independents = independents;
      this.initGame();

      this.initDisplay();
      this.hookUI();

      this.reactUI.switchScene("galaxyMap");
    }

    makeGame()
    {
      var playerData = this.makePlayers();
      var players = playerData.players;
      var independents = playerData.independents;
      var map = this.makeMap(playerData);

      var game = new Game(map, players, players[0]);
      game.independents = game.independents.concat(independents);

      return game;
    }

    makePlayers()
    {
      var players: Player[] = [];

      for (var i = 0; i < 5; i++)
      {
        var player = new Player(i >= 1);
        player.makeRandomFlag();

        players.push(player);
      }

      var pirates = new Player(true);
      pirates.setupPirates();

      return(
      {
        players: players,
        independents: [pirates]
      });
    }
    makeMap(playerData: {players: Player[], independents: Player[]})
    {
      var optionValues: Templates.MapGen.IMapGenOptionValues =
      {
        defaultOptions:
        {
          height: 1200,
          width: 1200,
          starCount: 40
        },
        basicOptions:
        {
          arms: 5,
          centerDensity: 40,
          starSizeRegularity: 100
        }
      }

      var mapGenResult = Templates.MapGen.spiralGalaxyGeneration(
        optionValues,
        playerData.players,
        playerData.independents
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
    }
    initDisplay()
    {
      this.renderer = this.renderer || new Renderer();
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
        if (hash === "#demo")
        {

        }
        else
        {
          this.reactUI.currentScene = hash.slice(1);
        }
      }
      else
      {
        this.reactUI.currentScene = "galaxyMap";
      }
    }
  }
}

var app = new Rance.App();
