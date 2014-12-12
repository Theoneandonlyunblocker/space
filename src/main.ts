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
      this.seed = Math.random();
      Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));

      this.loader = new Loader(function()
      {
        this.initGame();
        this.initDisplay();
        this.initUI();
      }.bind(this));
    }

    initGame()
    {
      var playerData = this.initPlayers();
      var players = playerData.players;
      var independents = playerData.independents;
      var map = this.initMap();

      this.humanPlayer = players[0];

      this.game = new Game(map, players, players[0]);
      this.game.independents.push(independents);

      this.playerControl = new PlayerControl(this.humanPlayer);

      return game;
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
    initMap()
    {
      var mapGen = new MapGen();
      mapGen.makeMap(Templates.MapGen.defaultMap);
      var galaxyMap = new GalaxyMap();
      galaxyMap.setMapGen(mapGen);

      return galaxyMap;
    }
    initDisplay()
    {
      this.images = loader.imageCache;
      this.renderer = new Renderer();

    }
    initUI()
    {
      var reactUI = this.reactUI = new ReactUI(
        document.getElementById("react-container"));

      reactUI.player = this.humanPlayer;
      reactUI.galaxyMap = this.game.galaxyMap;
      reactUI.game = this.game;
      reactUI.renderer = this.renderer;

      reactUI.currentScene = "galaxyMap";
      reactUI.render();
    }
  }

}