/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="building.ts" />
/// <reference path="star.ts" />
/// <reference path="flag.ts" />

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.player = idGenerators.player || 0;

  export class Player
  {
    id: number;
    name: string;
    color: number;
    secondaryColor: number;
    flag: Flag;
    icon: string;
    units:
    {
      [id: number]: Unit;
    } = {};
    fleets: Fleet[] = [];

    money: number;
    controlledLocations: Star[] = [];

    constructor(id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.player++;
      this.name = "Player " + this.id;
      this.money = 1000;
    }
    makeColorScheme()
    {
      var scheme = generateColorScheme(this.color);

      this.color = scheme.main;
      this.secondaryColor = scheme.secondary;
    }

    makeFlag()
    {
      if (!this.color || !this.secondaryColor) this.makeColorScheme();

      this.flag = new Flag(
      {
        width: 46,
        mainColor: this.color,
        secondaryColor: this.secondaryColor
      });

      this.flag.generateRandom();
      var canvas = this.flag.draw();
      this.icon = canvas.toDataURL();
      console.log(this.icon);

      var self = this;

    }
    addUnit(unit: Unit)
    {
      this.units[unit.id] = unit;
    }
    removeUnit(unit: Unit)
    {
      this.units[unit.id] = null;
      delete this.units[unit.id];
    }
    getAllUnits()
    {
      var allUnits = [];
      for (var unitId in this.units)
      {
        allUnits.push(this.units[unitId]);
      }
      return allUnits;
    }
    forEachUnit(operator: (Unit) => void)
    {
      for (var unitId in this.units)
      {
        operator(this.units[unitId]);
      }
    }
    getFleetIndex(fleet: Fleet)
    {
      return this.fleets.indexOf(fleet);
    }
    addFleet(fleet: Fleet)
    {
      if (this.getFleetIndex(fleet) >= 0)
      {
        return;
      }

      this.fleets.push(fleet);
    }
    removeFleet(fleet: Fleet)
    {
      var fleetIndex = this.getFleetIndex(fleet);

      if (fleetIndex <= 0)
      {
        return;
      }

      this.fleets.splice(fleetIndex, 1);
    }
    getFleetsWithPositions()
    {
      var positions = [];

      for (var i = 0; i < this.fleets.length; i++)
      {
        var fleet = this.fleets[i];

        positions.push(
        {
          position: fleet.location,
          data: fleet
        });
      }

      return positions;
    }

    hasStar(star: Star)
    {
      return (this.controlledLocations.indexOf(star) >= 0);
    }
    addStar(star: Star)
    {
      if (this.hasStar(star)) return false;

      this.controlledLocations.push(star);
    }
    removeStar(star: Star)
    {
      var index = this.controlledLocations.indexOf(star);

      if (index < 0) return false;

      this.controlledLocations.splice(index, 1);
    }
    getIncome()
    {
      var income = 0;

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        income += this.controlledLocations[i].getIncome();
      }

      return income;
    }
    getBuildableShips()
    {
      var templates = [];

      for (var type in Templates.ShipTypes)
      {
        templates.push(Templates.ShipTypes[type]);
      }

      return templates;
    }
    getIsland(start: Star): Star[]
    {
      var self = this;
      var connected:
      {
        [id: number]: Star;
      } = {};

      var toConnect: Star[] = [start];

      while (toConnect.length > 0)
      {
        var current = toConnect.pop();
        var neighbors = current.getNeighbors();
        var newFriendlyNeighbors = neighbors.filter(function(s)
        {
          return (s.owner && !connected[s.id] && s.owner.id === self.id);
        })

        toConnect = toConnect.concat(newFriendlyNeighbors);

        connected[current.id] = current;
      }

      var island: Star[] = [];
      for (var id in connected)
      {
        island.push(connected[id]);
      }

      return island;
    }
    getAllIslands(): Star[][]
    {
      var unConnected: Star[] = this.controlledLocations.slice(0);
      var islands: Star[][] = [];

      while (unConnected.length > 0)
      {
        var current = unConnected.pop();

        var currentIsland = this.getIsland(current);

        islands.push(currentIsland);
        unConnected = unConnected.filter(function(s)
        {
          return currentIsland.indexOf(s) < 0;
        });
      }

      return islands;
    }
    getBorderPolygons()
    {
      var islands = this.getAllIslands();
      var polys: Point[][] = [];
      var edges = [];

      for (var i = 0; i < islands.length; i++)
      {
        var poly: Point[] = [];

        for (var j = 0; j < islands[i].length; j++)
        {
          var star = islands[i][j];
          var halfedges = star.voronoiCell.halfedges;

          for (var k = 0; k < halfedges.length; k++)
          {
            var edge = halfedges[k].edge;
            if (!edge.lSite || !edge.rSite)
            {
              edges.push(edge);
              poly.push(edge.va);
            }
            else if (edge.lSite.owner !== this ||
              edge.rSite.owner !== this)
            {
              edges.push(edge);
              poly.push(edge.va);
            }
          }
        }

        poly.push(poly[0]);
        polys.push(poly);
      }
      return edges;
      //return polys;
    }
  }  
}
