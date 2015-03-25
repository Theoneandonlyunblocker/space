/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>
/// <reference path="itemgenerator.ts" />

/// <reference path="apploader.ts"/>
/// <reference path="gameloader.ts"/>

/// <reference path="../data/setdynamictemplateproperties.ts"/>

/// <reference path="shadermanager.ts"/>

/// <reference path="mctree.ts"/>
/// <reference path="borderpolygon.ts"/>

/// <reference path="mapai/mapevaluator.ts"/>
/// <reference path="mapai/aicontroller.ts"/>
/// 
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
    sector: 0,

    objective: 0
  }

  export class App
  {
    seed: any;
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

    constructor()
    {
      var self = this;

      this.seed = Math.random();
      Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));

      this.loader = new AppLoader(function()
      {
        self.makeApp();
      });

      setAllDynamicTemplateProperties();
    }
    makeApp()
    {
      Options = extendObject(defaultOptions);
      loadOptions();

      this.images = this.loader.imageCache;
      this.itemGenerator = new ItemGenerator();

      this.initUI();

      this.game = this.makeGame();
      this.initGame();

      this.initDisplay();

      this.reactUI.render();
    }
    destroy()
    {
      this.mapRenderer.destroy();
      this.mapRenderer = null;

      // renderer is kept for reusing the stage as
      // pixi doesnt like creating more than one
      this.renderer.destroy();

      this.reactUI.destroy();
      this.reactUI = null;
    }
    load(saveName: string)
    {
      var itemName = "Rance.Save." + saveName;
      var data = localStorage.getItem(itemName);
      if (!data) return;

      var parsed = JSON.parse(data);

      idGenerators = extendObject(parsed.idGenerators);


      this.destroy();


      this.initUI();

      this.game = new GameLoader().deserializeGame(parsed.gameData);
      this.initGame();

      this.initDisplay();
      if (parsed.cameraLocation)
      {
        this.renderer.camera.toCenterOn = parsed.cameraLocation;
      }


      this.reactUI.render();
    }

    makeGame()
    {
      var playerData = this.makePlayers();
      var players = playerData.players;
      var independents = playerData.independents;
      var map = this.makeMap(playerData);

      var game = new Game(map, players, players[0]);
      game.independents.push(independents);

      return game;
    }

    makePlayers()
    {
      var players = [];

      for (var i = 0; i < 5; i++)
      {
        var player = new Player(true);
        player.makeRandomFlag();

        players.push(player);
      }

      var pirates = new Player(true);
      pirates.setupPirates();

      return(
      {
        players: players,
        independents: pirates
      });
    }
    makeMap(playerData)
    {
      var mapGen = new MapGen();
      mapGen.players = playerData.players;
      mapGen.independents = playerData.independents;
      mapGen.makeMap(Templates.MapGen.defaultMap);
      var galaxyMap = new GalaxyMap();
      galaxyMap.setMapGen(mapGen);

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

      this.playerControl.reactUI = this.reactUI;

      this.reactUI.player = this.humanPlayer;
      this.reactUI.galaxyMap = this.game.galaxyMap;
      this.reactUI.game = this.game;
      this.reactUI.playerControl = this.playerControl;
    }
    initDisplay()
    {
      this.renderer = this.renderer || new Renderer();
      this.renderer.init();
      this.reactUI.renderer = this.renderer;

      this.mapRenderer = new MapRenderer(this.game.galaxyMap);
      this.mapRenderer.setParent(this.renderer.layers["map"]);
      this.mapRenderer.init();
      // some initialization is done when the react component owning the
      // renderer mounts, such as in reactui/galaxymap/galaxymap.ts
    }
    initUI()
    {
      var reactUI = this.reactUI = new ReactUI(
        document.getElementById("react-container"));

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
          reactUI.currentScene = hash.slice(1);
        }
      }
      else
      {
        reactUI.currentScene = "galaxyMap";
      }

      reactUI.render();
    }
  }
}

var app = new Rance.App();