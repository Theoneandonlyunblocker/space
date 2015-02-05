/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="building.ts" />
/// <reference path="star.ts" />
/// <reference path="flag.ts" />
/// <reference path="item.ts" />

module Rance
{

  export class Player
  {
    id: number;
    name: string;
    color: number;
    colorAlpha: number;
    secondaryColor: number;
    flag: Flag;
    icon: string;
    units:
    {
      [id: number]: Unit;
    } = {};
    fleets: Fleet[] = [];
    items: Item[] = [];

    money: number;
    controlledLocations: Star[] = [];

    visionIsDirty: boolean = true;
    visibleStars:
    {
      [id: number]: Star;
    } = {};
    revealedStars:
    {
      [id: number]: Star;
    } = {};

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
    setupPirates()
    {
      this.name = "Independent"
      this.color = 0x000000;
      this.colorAlpha = 0;
      this.secondaryColor = 0xFFFFFF;

      var foregroundEmblem = new Emblem(this.secondaryColor);
      foregroundEmblem.inner = 
      {
        type: "both",
        foregroundOnly: true,
        imageSrc: "pirateEmblem.png"
      };

      this.flag = new Flag(
      {
        width: 46,
        mainColor: this.color,
        secondaryColor: this.secondaryColor,
        foregroundEmblem: foregroundEmblem
      });

      var canvas = this.flag.draw();
      this.icon = canvas.toDataURL();
    }
    makeFlag(seed?: any)
    {
      if (!this.color || !this.secondaryColor) this.makeColorScheme();

      this.flag = new Flag(
      {
        width: 46,
        mainColor: this.color,
        secondaryColor: this.secondaryColor
      });

      this.flag.generateRandom(seed);
      var canvas = this.flag.draw();
      this.icon = canvas.toDataURL();
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
      this.visionIsDirty = true;
    }
    removeFleet(fleet: Fleet)
    {
      var fleetIndex = this.getFleetIndex(fleet);

      if (fleetIndex <= 0)
      {
        return;
      }

      this.fleets.splice(fleetIndex, 1);
      this.visionIsDirty = true;
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
      this.visionIsDirty = true;
    }
    removeStar(star: Star)
    {
      var index = this.controlledLocations.indexOf(star);

      if (index < 0) return false;

      this.controlledLocations.splice(index, 1);
      this.visionIsDirty = true;
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
    getNeighboringStars(): Star[]
    {
      var stars:
      {
        [id: number]: Star;
      } = {};

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var currentOwned = this.controlledLocations[i];
        var frontier =  currentOwned.getLinkedInRange(1).all;
        for (var j = 0; j < frontier.length; j++)
        {
          if (stars[frontier[j].id])
          {
            continue;
          }
          else if (frontier[j].owner.id === this.id)
          {
            continue;
          }
          else
          {
            stars[frontier[j].id] = frontier[j];
          }
        }
      }

      var allStars = [];

      for (var id in stars)
      {
        allStars.push(stars[id]);
      }

      return allStars;
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
    getBorderEdges()
    {
      var islands = this.getAllIslands();
      var edges = [];

      for (var i = 0; i < islands.length; i++)
      {
        var island = [];

        for (var j = 0; j < islands[i].length; j++)
        {
          var star = islands[i][j];
          var halfedges = star.voronoiCell.halfedges;

          for (var k = 0; k < halfedges.length; k++)
          {
            var edge = halfedges[k].edge;
            if (!edge.lSite || !edge.rSite)
            {
              island.push(edge);
            }
            else if (edge.lSite.owner !== this ||
              edge.rSite.owner !== this)
            {
              island.push(edge);
            }
          }
        }
        edges.push(island);
      }
      return edges;
    }
    getBorderPolygons()
    {
      var edgeGroups = this.getBorderEdges();
      var polys = [];

      for (var i = 0; i < edgeGroups.length; i++)
      {
        var island = edgeGroups[i];
        var poly = [];

        var edgesByLocation:
        {
          [x:string]:
          {
            [y:string]: {va: number; vb: number}[];
          }
        } = {};

        function setVertex(vertex, edge)
        {
          var x = Math.round(vertex.x * 100);
          var y = Math.round(vertex.y * 100);
          if (!edgesByLocation[x])
          {
            edgesByLocation[x] = {};
          }
          if (!edgesByLocation[x][y])
          {
            edgesByLocation[x][y] = [];
          }

          edgesByLocation[x][y].push(edge);
        }
        function setEdge(edge)
        {
          setVertex(edge.va, edge);
          setVertex(edge.vb, edge);
        }
        function removeEdge(edge)
        {
          var a = edgesByLocation[edge.va.x][edge.va.y];
          var b = edgesByLocation[edge.vb.x][edge.vb.y];

          a.splice(a.indexOf(edge));
          b.splice(b.indexOf(edge));
        }
        function getEdges(x, y)
        {
          return edgesByLocation[Math.round(x * 100)][Math.round(y * 100)];
        }
        function getOtherVertex(edge, vertex)
        {
          if (pointsEqual(edge.va, vertex)) return edge.vb;
          else return edge.va;
        }
        function getOtherEdgeAtVertex(vertex, edge)
        {
          var edges = getEdges(vertex.x, vertex.y);

          return edges.filter(function(toFilter)
          {
            return toFilter !== edge;
          })[0];
        }
        function getNext(currentVertex, currentEdge)
        {
          var nextVertex = getOtherVertex(currentEdge, currentVertex);
          var nextEdge = getOtherEdgeAtVertex(nextVertex, currentEdge);

          return(
          {
            vertex: nextVertex,
            edge: nextEdge
          });
        }

        for (var j = 0; j < island.length; j++)
        {
          setEdge(island[j]);
        }
        var edgesDone = [];

        var currentEdge = island[0];
        var currentVertex = currentEdge.vb;
        poly.push(currentVertex);


        while (edgesDone.length !== island.length)
        {
          edgesDone.push(currentEdge);

          if (!getNext(currentVertex, currentEdge).edge) debugger;
          var next = getNext(currentVertex, currentEdge);


          currentEdge = next.edge;
          currentVertex = next.vertex;

          if (poly[poly.length - 1] === next.vertex)
          {
            debugger;
          }
          else if (pointsEqual(poly[poly.length - 1], next.vertex))
          {
            debugger;
          }
          poly.push(next.vertex);
        }

        
        polys.push(poly);
      }
      return polys;
    }
    updateVisibleStars()
    {
      this.visibleStars = {};

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var starVisible = this.controlledLocations[i].getVision();

        for (var j = 0; j < starVisible.length; j++)
        {
          var star = starVisible[j];
          if (!this.visibleStars[star.id])
          {
            this.visibleStars[star.id] = star;

            if (!this.revealedStars[star.id])
            {
              this.revealedStars[star.id] = star;
            }
          }
        }
      }

      for (var i = 0; i < this.fleets.length; i++)
      {
        var fleetVisible = this.fleets[i].getVision();

        for (var j = 0; j < fleetVisible.length; j++)
        {
          var star = fleetVisible[j];
          if (!this.visibleStars[star.id])
          {
            this.visibleStars[star.id] = star;

            if (!this.revealedStars[star.id])
            {
              this.revealedStars[star.id] = star;
            }
          }
        }
      }

      this.visionIsDirty = false;

      eventManager.dispatchEvent("renderMap");
    }
    getVisibleStars()
    {
      if (this.visionIsDirty) this.updateVisibleStars();

      var visible: Star[] = [];

      for (var id in this.visibleStars)
      {
        visible.push(this.visibleStars[id]);
      }

      return visible;
    }
    getRevealedStars()
    {
      if (this.visionIsDirty) this.updateVisibleStars();

      var toReturn: Star[] = [];

      for (var id in this.revealedStars)
      {
        toReturn.push(this.revealedStars[id]);
      }

      return toReturn;
    }
    getRevealedButNotVisibleStars()
    {
      if (this.visionIsDirty) this.updateVisibleStars();

      var toReturn: Star[] = [];

      for (var id in this.revealedStars)
      {
        if (!this.visibleStars[id])
        {
          toReturn.push(this.revealedStars[id]);
        }
      }

      return toReturn;
    }
    addItem(item: Item)
    {
      this.items.push(item);
    }
    getAllBuildableItems()
    {
      var alreadyAdded: any = {};
      var allBuildable = [];

      for (var i = 0; i < this.controlledLocations.length; i++)
      {
        var star = this.controlledLocations[i];

        var buildableItems = star.getBuildableItems().all;
        for (var j = 0; j < buildableItems.length; j++)
        {
          var item = buildableItems[j];

          if (alreadyAdded[item.type])
          {
            continue;
          }
          else
          {
            alreadyAdded[item.type] = true;
            allBuildable.push(
            {
              star: star,
              template: item
            });
          }
        }
      }

      return allBuildable;
    }
    serialize()
    {
      var data: any = {};

      data.id = this.id;
      data.name = this.name;
      data.color = this.color;
      data.colorAlpha = this.colorAlpha;
      data.secondaryColor = this.secondaryColor;

      data.flag = this.flag.serialize();

      data.unitIds = [];
      for (var id in this.units)
      {
        data.unitIds.push(id);
      }
      data.fleets = this.fleets.map(function(fleet){return fleet.serialize()});
      data.money = this.money;
      data.controlledLocationIds =
        this.controlledLocations.map(function(star){return star.id});

      data.items = this.items.map(function(item){return item.serialize()});

      data.revealedStarIds = [];
      for (var id in this.revealedStars)
      {
        data.revealedStarIds.push(id);
      }

      data.buildings = [];
      

      return data;
    }
  }  
}
