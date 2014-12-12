/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>
/// <reference path="loader.ts"/>

/// <reference path="shadermanager.ts"/>

module Rance
{
  export class App
  {
    seed: any;
    loader: Loader;
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

      this.loader = new Loader(function()
      {
        self.images = self.loader.imageCache;
        self.initGame();
        self.initDisplay();
        self.initUI();
      });
    }

    initGame()
    {
      var playerData = this.initPlayers();
      var players = playerData.players;
      var independents = playerData.independents;
      var map = this.initMap(playerData);

      this.humanPlayer = players[0];

      this.game = new Game(map, players, players[0]);
      this.game.independents.push(independents);

      map.game = this.game;

      this.playerControl = new PlayerControl(this.humanPlayer);

      return this.game;
    }
    initPlayers()
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
    initMap(playerData)
    {
      var mapGen = new MapGen();
      mapGen.players = playerData.players;
      mapGen.independents = playerData.independents;
      mapGen.makeMap(Templates.MapGen.defaultMap);
      var galaxyMap = new GalaxyMap();
      galaxyMap.setMapGen(mapGen);

      return galaxyMap;
    }
    initDisplay()
    {
      this.renderer = new Renderer();
      this.renderer.init();

      this.mapRenderer = new MapRenderer(this.game.galaxyMap);
      this.mapRenderer.setParent(this.renderer.layers["map"]);
      this.mapRenderer.init();
      this.mapRenderer.setMapMode("default");
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