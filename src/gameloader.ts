/// <reference path="game.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="player.ts"/>
/// <reference path="galaxymap.ts"/>

module Rance
{
  export class GameLoader
  {
    map: GalaxyMap;
    humanPlayer: Player;
    players: Player[] = [];
    playersById:
    {
      [id: number]: Player;
    } = {};
    pointsById:
    {
      [id: number]: Star;
    } = {};

    constructor()
    {

    }

    deSerializeGame(data)
    {

      this.map = this.deSerializeMap(data.galaxyMap);

      for (var i = 0; i < data.players.length; i++)
      {
        var player = data.players[id];
        var id = player;
        this.playersById[id] = this.deSerializePlayer(player);
        this.players.push(player);
      }

      this.humanPlayer = this.playersById[data.humanPlayerId];


      return new Game(this.map, this.players, this.humanPlayer);
    }
    deSerializeMap(data)
    {
      var mapGen = new MapGen();

      for (var i = 0; i < data.regionNames; i++)
      {
        mapGen.makeRegion(data.regionNames[i]);
      }

      var allPoints = [];

      for (var i = 0; i < data.allPoints.length; i++)
      {
        var point = this.deSerializePoint(data.allPoints[i]);
        allPoints.push(point);
        this.pointsById[point.id] = point;
      }

      for (var i = 0; i < allPoints.length; i++)
      {
        for (var j = 0; j < allPoints[i].linksToIds.length; j++)
        {
          allPoints[i].addLink(allPoints[i].linksToIds[j]);
        }
      }

      mapGen.points = allPoints;
      mapGen.makeVoronoi();

      var galaxyMap = new GalaxyMap();
      galaxyMap.setMapGen(mapGen);

      return this.map;
    }
    deSerializePoint(data)
    {
      var star = new Star(data.x, data.y, data.id);
      star.name = data.name;
      star.distance = data.distance;
      star.region = data.region;
      star.baseIncome = data.baseIncome;

      return star;
    }

    deSerializePlayer(data)
    {
      var player = new Player(data.id);

      player.money = data.money;

      // color scheme & flag
      if (data.name === "Independent")
      {
        player.setupPirates();
      }
      else
      {
        player.color = data.color;
        player.secondaryColor = data.secondaryColor;
        player.colorAlpha = data.colorAlpha;

        player.makeFlag(data.flag.seed);
      }

      // fleets & ships
      for (var i = 0; i < data.fleets.length; i++)
      {
        var fleet = data.fleets[i];
        player.addFleet(this.deSerializeFleet(player, fleet));
      }

      return player;
    }
    deSerializeFleet(player, data)
    {
      var ships = [];

      for (var i = 0; i < data.ships.length; i++)
      {
        var ship = this.deSerializeShip(data.ships[i]);
        player.addUnit(ship);
        ships.push(ship);
      }

      return new Fleet(player, ships, this.pointsById[data.locationId], data.id);
    }
    deSerializeShip(data)
    {
      var template = Templates.ShipTypes[data.templateType];

      var cData: any = {};
      var ship = new Unit(template, data.id);
      ship.name = data.name;


    }
  }
  
}