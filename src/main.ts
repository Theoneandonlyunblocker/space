/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>

/// <reference path="apploader.ts"/>
/// <reference path="gameloader.ts"/>

/// <reference path="shadermanager.ts"/>

/// <reference path="mctree.ts"/>

var a, b;
module Rance
{
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

    constructor()
    {
      var self = this;

      this.seed = Math.random();
      Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));

      this.loader = new AppLoader(function()
      {
        var gameData;

        if (false && localStorage && localStorage.length > 0)
        {
          for (var key in localStorage)
          {
            if (key.indexOf("Rance.Save") > -1)
            {
              var gameData = JSON.parse(localStorage[Object.keys(localStorage)[0]]);
              break;
            }
          }
        }

        self.makeApp(gameData);
      });
    }
    makeApp(savedGame?)
    {
      this.images = this.loader.imageCache;
      this.game = savedGame ? new GameLoader().deserializeGame(savedGame) : this.makeGame();
      this.initGame();
      this.initDisplay();
      this.initUI();
    }
    destroy()
    {
      this.renderer.destroy();
      this.reactUI.destroy();
    }
    load(saveName: string)
    {
      var itemName = "Rance.Save." + saveName;
      var data = localStorage.getItem(itemName);
      var parsed = JSON.parse(data);

      this.destroy();

      this.makeApp(parsed.gameData);
    }

    makeGame()
    {
      var playerData = this.makePlayers();
      var players = playerData.players;
      var independents = playerData.independents;
      var map = this.makeMap(playerData);

      var game = new Game(map, players, players[0]);
      game.independents.push(independents);

      for (var itemType in Templates.Items)
      {
        for (var i = 0; i < 2; i++)
        {
          var item = new Item(Templates.Items[itemType]);
          players[0].addItem(item);
        }
      }

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

      reactUI.currentScene = "galaxyMap";
      reactUI.render();
    }
  }
}

var app = new Rance.App();