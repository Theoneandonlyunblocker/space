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
/// <reference path="mapevaluator.ts"/>
/// <reference path="pathfindingarrow.ts"/>

/// <reference path="borderpolygon.ts"/>

/// <reference path="../data/tutorials/uitutorial.ts"/>

var a, b; // TODO
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
    sector: 0
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

      /*
      mapOptions:
      {
        width: 600,
        height: 600
      },
      starGeneration:
      {
        galaxyType: "spiral",
        totalAmount: 40,
        arms: 5,
        centerSize: 0.4,
        amountInCenter: 0.3
      },
      relaxation:
      {
        timesToRelax: 5,
        dampeningFactor: 2
      }
      these map parameters break map gen with following seed as per 23.01.2015
       */
      //this.seed = 0.5727128006983548;
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
      this.images = this.loader.imageCache;
      this.itemGenerator = new ItemGenerator();
      this.game = this.makeGame();
      this.initGame();
      this.initDisplay();
      this.initUI();

      a = new Rance.MapEvaluator(this.game.galaxyMap, this.humanPlayer); // TODO
      b = new Rance.PathfindingArrow(this.renderer.layers["select"]); // TODO
    }
    destroy()
    {
      this.renderer.destroy();
      this.reactUI.destroy();
      this.reactUI = null;
    }
    load(saveName: string)
    {
      var itemName = "Rance.Save." + saveName;
      var data = localStorage.getItem(itemName);
      var parsed = JSON.parse(data);
      this.mapRenderer.preventRender = true;

      this.destroy();

      this.game = new GameLoader().deserializeGame(parsed.gameData);

      this.initGame();

      this.mapRenderer.preventRender = false;

      this.mapRenderer.setParent(this.renderer.layers["map"]);
      this.mapRenderer.setMap(this.game.galaxyMap);
      this.mapRenderer.setAllLayersAsDirty();

      idGenerators = cloneObject(parsed.idGenerators);

      this.initUI();
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
        var player = new Player();
        player.makeFlag();

        players.push(player);
      }

      var pirates = new Player();
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
      this.humanPlayer = this.game.humanPlayer;

      if (this.playerControl) this.playerControl.removeEventListeners();

      this.playerControl = new PlayerControl(this.humanPlayer);

      return this.game;
    }
    initDisplay()
    {
      this.renderer = new Renderer();
      this.renderer.init();

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

      this.playerControl.reactUI = reactUI;

      reactUI.player = this.humanPlayer;
      reactUI.galaxyMap = this.game.galaxyMap;
      reactUI.game = this.game;
      reactUI.renderer = this.renderer;
      reactUI.playerControl = this.playerControl;

      var uriParser = document.createElement("a");
      uriParser.href = document.URL;
      var hash = uriParser.hash;
      if (hash)
      {
        reactUI.currentScene = hash.slice(1);
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