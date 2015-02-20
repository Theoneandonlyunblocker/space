/// <reference path="game.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="player.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="sector.ts"/>

module Rance
{
  export class GameLoader
  {
    map: GalaxyMap;
    humanPlayer: Player;
    players: Player[] = [];
    independents: Player[] = [];
    playersById:
    {
      [id: number]: Player;
    } = {};
    pointsById:
    {
      [id: number]: Star;
    } = {};
    unitsById:
    {
      [id: number]: Unit;
    } = {};
    buildingsByControllerId:
    {
      [id: number]: Building;
    } = {};
    sectors:
    {
      [id: number]: Sector;
    } = {};

    constructor()
    {

    }

    deserializeGame(data)
    {

      this.map = this.deserializeMap(data.galaxyMap);

      for (var i = 0; i < data.players.length; i++)
      {
        var playerData = data.players[i];
        var id = playerData.id;
        var player = this.playersById[id] = this.deserializePlayer(playerData);
        if (player.name === "Independent")
        {
          this.independents.push(player);
        }
        else
        {
          this.players.push(player);
        }
      }

      this.humanPlayer = this.playersById[data.humanPlayerId];

      this.deserializeBuildings(data.galaxyMap);

      var game = new Game(this.map, this.players, this.humanPlayer);
      game.independents = game.independents.concat(this.independents);

      return game;
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
      mapGen.sectors = this.sectors;
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
      star.backgroundSeed = data.backgroundSeed;

      if (isFinite(data.sectorId))
      {
        if (!this.sectors[data.sectorId])
        {
          this.sectors[data.sectorId] = new Sector(data.sectorId);
        }
        this.sectors[data.sectorId].addStar(star);
      }
      
      var buildableItems: any = {};

      for (var techLevel in data.buildableItems)
      {
        buildableItems[techLevel] = data.buildableItems[techLevel].map(function(templateType)
        {
          return Templates.Items[templateType];
        });
      }

      star.buildableItems = buildableItems;

      return star;
    }
    deserializeBuildings(data)
    {
      for (var i = 0; i < data.allPoints.length; i++)
      {
        var starData = data.allPoints[i];
        var star = this.pointsById[starData.id];

        for (var category in starData.buildings)
        {
          for (var j = 0; j < starData.buildings[category].length; j++)
          {
            var buildingData = starData.buildings[category][j];
            var building = this.deserializeBuilding(buildingData);

            star.addBuilding(building);

          }
        }
      }
      
    }
    deserializeBuilding(data)
    {
      var template = Templates.Buildings[data.templateType];
      var building = new Building(
      {
        template: template,
        location: this.pointsById[data.locationId],
        controller: this.playersById[data.controllerId],

        upgradeLevel: data.upgradeLevel,
        totalCost: data.totalCost,
        id: data.id
      });

      return building;
    }
    deserializePlayer(data)
    {
      var player = new Player(data.id);

      player.money = data.money;

      // color scheme & flag
      if (data.isIndependent)
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

      // stars
      for (var i = 0; i < data.controlledLocationIds.length; i++)
      {
        player.addStar(this.pointsById[data.controlledLocationIds[i]]);
      }

      for (var i = 0; i < data.items.length; i++)
      {
        this.deserializeItem(data.items[i], player);
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

      this.unitsById[ship.id] = ship;

      return ship;
    }
    deserializeItem(data, player: Player)
    {
      var template = Templates.Items[data.templateType];

      var item = new Item(template, data.id);

      player.addItem(item);
      if (isFinite(data.unitId))
      {
        this.unitsById[data.unitId].addItem(item);
      }
    }
  }
  
}