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
    buildingsByControllerId:
    {
      [id: number]: Building;
    } = {};

    constructor()
    {

    }

    deserializeGame(data)
    {

      this.map = this.deserializeMap(data.galaxyMap);

      for (var i = 0; i < data.players.length; i++)
      {
        var player = data.players[i];
        var id = player.id;
        this.playersById[id] = this.deserializePlayer(player);
        this.players.push(player);
      }

      this.humanPlayer = this.playersById[data.humanPlayerId];


      return new Game(this.map, this.players, this.humanPlayer);
    }
    deserializeMap(data)
    {
      var mapGen = new MapGen();
      mapGen.maxWidth = data.maxWidth;
      mapGen.maxHeight = data.maxHeight;

      for (var i = 0; i < data.regionNames; i++)
      {
        mapGen.makeRegion(data.regionNames[i]);
      }

      var allPoints = [];

      for (var i = 0; i < data.allPoints.length; i++)
      {
        var point = this.deserializePoint(data.allPoints[i]);
        allPoints.push(point);
        this.pointsById[point.id] = point;
      }

      for (var i = 0; i < data.allPoints.length; i++)
      {
        var dataPoint = data.allPoints[i];
        var realPoint = this.pointsById[dataPoint.id];

        for (var j = 0; j < dataPoint.linksToIds.length; j++)
        {
          var linkId = dataPoint.linksToIds[j];
          var linkPoint = this.pointsById[linkId]
          realPoint.addLink(linkPoint);
        }
      }

      mapGen.points = allPoints;
      mapGen.makeVoronoi();

      var galaxyMap = new GalaxyMap();
      galaxyMap.setMapGen(mapGen);

      return galaxyMap;
    }
    deserializePoint(data)
    {
      var star = new Star(data.x, data.y, data.id);
      star.name = data.name;
      star.distance = data.distance;
      star.region = data.region;
      star.baseIncome = data.baseIncome;

      for (var category in data.buildings)
      {
        for (var i = 0; i < data.buildings[category]; i++)
        {
          var buildingData = data.buildings[category][i];
          var building = this.deserializeBuilding(buildingData);
        }
      }

      return star;
    }

    deserializePlayer(data)
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
        player.addFleet(this.deserializeFleet(player, fleet));
      }



      return player;
    }
    deserializeFleet(player, data)
    {
      var ships = [];

      for (var i = 0; i < data.ships.length; i++)
      {
        var ship = this.deserializeShip(data.ships[i]);
        player.addUnit(ship);
        ships.push(ship);
      }

      return new Fleet(player, ships, this.pointsById[data.locationId], data.id);
    }
    deserializeShip(data)
    {
      var template = Templates.ShipTypes[data.templateType];

      var ship = new Unit(template, data.id, data);

      return ship;
    }
  }
  
}