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
    regions:
    {
      [id: string]: Region;
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
        if (player.isIndependent)
        {
          this.independents.push(player);
        }
        else
        {
          this.players.push(player);
        }
      }
      for (var i = 0; i < data.players.length; i++)
      {
        var playerData = data.players[i];
        this.deserializeDiplomacyStatus(this.playersById[playerData.id], 
          playerData.diplomacyStatus);
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

      for (var i = 0; i < data.regions.length; i++)
      {
        this.regions[data.regions[i].id] = this.deserializeRegion(data.regions[i]);
      }
      for (var i = 0; i < data.sectors.length; i++)
      {
        this.sectors[data.sectors[i].id] = this.deserializeSector(data.sectors[i]);
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
      mapGen.regions = this.regions;
      mapGen.sectors = this.sectors;
      mapGen.makeVoronoi();

      var galaxyMap = new GalaxyMap();
      galaxyMap.setMapGen(mapGen);

      return galaxyMap;
    }
    deserializeRegion(data)
    {
      var region = new Region(data.id, [], data.isFiller)
      return region;
    }
    deserializeSector(data)
    {
      var sector = new Sector(data.id, data.color);
      return sector;
    }
    deserializePoint(data)
    {
      var star = new Star(data.x, data.y, data.id);
      star.name = data.name;
      star.distance = data.distance;
      star.baseIncome = data.baseIncome;
      star.backgroundSeed = data.backgroundSeed;

      this.regions[data.regionId].addStar(star);
      if (this.sectors[data.sectorId]) this.sectors[data.sectorId].addStar(star);

      if (data.resourceType)
      {
        star.setResource(Templates.Resources[data.resourceType]);
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
      var player = new Player(data.isAI, data.id);

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

        if (data.flag && data.flag.mainColor)
        {
          player.flag = this.deserializeFlag(data.flag);
          player.setIcon();
        }
        else
        {
          player.makeRandomFlag();
        }
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

      for (var i = 0; i < data.revealedStarIds.length; i++)
      {
        var id = data.revealedStarIds[i];
        player.revealedStars[id] = this.pointsById[id];
      }

      return player;
    }
    deserializeDiplomacyStatus(player: Player, data)
    {
      if (data)
      {
        for (var i = 0; i < data.metPlayerIds.length; i++)
        {
          var id = data.metPlayerIds[i];
          player.diplomacyStatus.metPlayers[id] = this.playersById[id];
        }

        player.diplomacyStatus.statusByPlayer = data.statusByPlayer;

        for (var playerId in data.attitudeModifiersByPlayer)
        {
          var modifiers = data.attitudeModifiersByPlayer[playerId];

          if (!modifiers || modifiers.length === 0)
          {
            player.diplomacyStatus.attitudeModifiersByPlayer[playerId] = [];
            continue;
          }

          for (var i = 0; i < modifiers.length; i++)
          {
            var template = Templates.AttitudeModifiers[modifiers[i].templateType];
            var modifier = new AttitudeModifier(
            {
              template: template,
              startTurn: modifiers[i].startTurn,
              endTurn: modifiers[i].endTurn,
              strength: modifiers[i].strength
            });

            player.diplomacyStatus.addAttitudeModifier(this.playersById[playerId], modifier);
          }
        }
      }
    }
    deserializeFlag(data)
    {
      var deserializeEmblem = function(emblemData, color)
      {
        var inner = Templates.SubEmblems[emblemData.innerType];
        var outer = emblemData.outerType ?
          Templates.SubEmblems[emblemData.outerType] : null;

        return new Emblem(color, emblemData.alpha, inner, outer);

      };

      var flag = new Flag(
      {
        width: 46, // FLAG_SIZE
        mainColor: data.mainColor,
        secondaryColor: data.secondaryColor,
        tetriaryColor: data.tetriaryColor
      });

      if (data.customImage)
      {
        flag.setCustomImage(data.customImage);
      }
      else if (data.seed)
      {
        flag.generateRandom(data.seed);
      }
      else
      {
        if (data.foregroundEmblem)
        {
          var fgEmblem = deserializeEmblem(data.foregroundEmblem, data.secondaryColor);
          flag.setForegroundEmblem(fgEmblem);
        }
        if (data.backgroundEmblem)
        {
          var bgEmblem = deserializeEmblem(data.backgroundEmblem, data.tetriaryColor);
          flag.setBackgroundEmblem(bgEmblem);
        }
      }

      return flag;
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