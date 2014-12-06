/// <reference path="point.ts" />
/// <reference path="player.ts" />
/// <reference path="fleet.ts" />
/// <reference path="building.ts" />

module Rance
{
  var idGenerators = idGenerators || {};
  idGenerators.star = idGenerators.star || 0;

  export class Star implements Point
  {
    id: number;
    x: number;
    y: number;
    linksTo: Star[] = [];
    linksFrom: Star[] = [];
    distance: number;
    region: string;

    indexedNeighborsInRange:
    {
      [range: number]:
      {
        all: Star[];
        byRange:
        {
          [range: number]: Star[];
        };
      };
    } = {};

    name: string;
    owner: Player;
    fleets:
    {
      [playerId: string] : Fleet[];
    } = {};

    buildings:
    {
      [category: string] : Building[];
    } = {};

    baseIncome: number;

    voronoiId: number;
    voronoiCell: any;

    constructor(x: number, y: number, id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.star++;
      this.name = "Star " + this.id;

      this.x = x;
      this.y = y;
    }

    // BUILDINGS
    addBuilding(building: Building)
    {
      if (!this.buildings[building.template.category])
      {
        this.buildings[building.template.category] = [];
      }

      var buildings = this.buildings[building.template.category];

      if (buildings.indexOf(building) >= 0)
      {
        throw new Error("Already has building");
      }

      buildings.push(building);

      if (building.template.category === "defence")
      {
        this.updateController();
      }
    }
    removeBuilding(building: Building)
    {
      if (
        !this.buildings[building.template.category] ||
        this.buildings[building.template.category].indexOf(building) < 0
      )
      {
        throw new Error("Location doesn't have building")
      }

      var buildings = this.buildings[building.template.category];

      this.buildings[building.template.category] =
        buildings.splice(buildings.indexOf(building), 1);
    }

    getSecondaryController()
    {
      if (!this.buildings["defence"]) return null;

      var defenceBuildings = this.buildings["defence"];
      for (var i = 0; i < defenceBuildings.length; i++)
      {
        if (defenceBuildings[i].controller !== this.owner)
        {
          return defenceBuildings[i].controller;
        }
      }

      return null;
    }
    updateController()
    {
      if (!this.buildings["defence"]) return null;

      var oldOwner = this.owner;
      if (oldOwner)
      {
        if (oldOwner === newOwner) return;

        oldOwner.removeStar(this);
      }
      var newOwner = this.buildings["defence"][0].controller;

      newOwner.addStar(this);

      this.owner = newOwner;

      eventManager.dispatchEvent("renderMap");
    }
    getIncome()
    {
      var tempBuildingIncome = 0;
      if (this.buildings["economy"]) tempBuildingIncome = this.buildings["economy"].length * 20;
      return this.baseIncome + tempBuildingIncome;
    }
    getBuildingsByType(buildingTemplate: Templates.IBuildingTemplate)
    {
      var categoryBuildings = this.buildings[buildingTemplate.category];

      var buildings = [];

      if (categoryBuildings)
      {
        for (var i = 0; i < categoryBuildings.length; i++)
        {
          if (categoryBuildings[i].template.type === buildingTemplate.type)
          {
            buildings.push(categoryBuildings[i]);
          }
        }
      }

      return buildings;
    }
    getBuildableBuildings()
    {
      var canBuild = [];
      for (var buildingType in Templates.Buildings)
      {
        var template: Templates.IBuildingTemplate = Templates.Buildings[buildingType];
        var alreadyBuilt = this.getBuildingsByType(template);

        if (alreadyBuilt.length < template.maxPerType)
        {
          canBuild.push(template);
        }
      }

      return canBuild;
    }

    // FLEETS
    getAllFleets()
    {
      var allFleets = [];

      for (var playerId in this.fleets)
      {
        allFleets = allFleets.concat(this.fleets[playerId]);
      }

      return allFleets;
    }
    getFleetIndex(fleet: Fleet)
    {
      if (!this.fleets[fleet.player.id]) return -1;

      return this.fleets[fleet.player.id].indexOf(fleet);
    }
    hasFleet(fleet: Fleet)
    {
      return this.getFleetIndex(fleet) >= 0;
    }
    addFleet(fleet: Fleet)
    {
      if (!this.fleets[fleet.player.id])
      {
        this.fleets[fleet.player.id] = [];
      }

      if (this.hasFleet(fleet)) return false;

      this.fleets[fleet.player.id].push(fleet);
    }
    addFleets(fleets: Fleet[])
    {
      for (var i = 0; i < fleets.length; i++)
      {
        this.addFleet(fleets[i]);
      }
    }
    removeFleet(fleet: Fleet)
    {
      var fleetIndex = this.getFleetIndex(fleet);

      if (fleetIndex < 0) return false;

      this.fleets[fleet.player.id].splice(fleetIndex, 1);
    }
    removeFleets(fleets: Fleet[])
    {
      for (var i = 0; i < fleets.length; i++)
      {
        this.removeFleet(fleets[i]);
      }
    }
    getAllShipsOfPlayer(player: Player)
    {
      var allShips: Unit[] = [];

      var fleets = this.fleets[player.id];
      if (!fleets) return [];

      for (var i = 0; i < fleets.length; i++)
      {
        allShips = allShips.concat(fleets[i].ships);
      }

      return allShips;
    }
    getTargetsForPlayer(player: Player)
    {
      var buildingTarget = this.getFirstEnemyDefenceBuilding(player);
      var buildingController = buildingTarget ? buildingTarget.controller : null;
      var fleetOwners = this.getEnemyFleetOwners(player, buildingController);

      var targets = [];

      if (buildingTarget)
      {
        targets.push(
        {
          type: "building",
          enemy: buildingTarget.controller,
          building: buildingTarget,
          ships: this.getAllShipsOfPlayer(buildingTarget.controller)
        });
      }
      for (var i = 0; i < fleetOwners.length; i++)
      {
        targets.push(
        {
          type: "fleet",
          enemy: fleetOwners[i],
          building: null,
          ships: this.getAllShipsOfPlayer(fleetOwners[i])
        });
      }

      return targets;
    }
    getFirstEnemyDefenceBuilding(player: Player)
    {
      if (!this.buildings["defence"]) return null;

      var defenceBuildings = this.buildings["defence"].slice(0);
      if (this.owner === player) defenceBuildings = defenceBuildings.reverse();

      for (var i = defenceBuildings.length - 1; i >= 0; i--)
      {
        if (defenceBuildings[i].controller.id !== player.id)
        {
          return defenceBuildings[i];
        }
      }

      return null;
    }
    getEnemyFleetOwners(player: Player, excludedTarget?: Player)
    {
      var fleetOwners: Player[] = [];

      for (var playerId in this.fleets)
      {
        if (playerId == player.id) continue;
        else if (excludedTarget && playerId == excludedTarget.id) continue;
        else if (this.fleets[playerId].length < 1) continue;

        fleetOwners.push(this.fleets[playerId][0].player);
      }

      return fleetOwners;
    }

    // MAP GEN
    setPosition(x: number, y: number)
    {
      this.x = x;
      this.y = y;
    }
    hasLink(linkTo: Star)
    {
      return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
    }
    addLink(linkTo: Star)
    {
      if (this.hasLink(linkTo)) return;

      this.linksTo.push(linkTo);
      linkTo.linksFrom.push(this);
    }
    removeLink(linkTo: Star)
    {
      if (!this.hasLink(linkTo)) return;

      var toIndex = this.linksTo.indexOf(linkTo);
      if (toIndex >= 0)
      {
        this.linksTo.splice(toIndex, 1);
      }
      else
      {
        this.linksFrom.splice(this.linksFrom.indexOf(linkTo), 1);
      }

      linkTo.removeLink(this);
    }
    getAllLinks()
    {
      return this.linksTo.concat(this.linksFrom);
    }
    clearLinks()
    {
      this.linksTo = [];
      this.linksFrom = [];
    }
    getLinksByRegion()
    {
      var linksByRegion:
      {
        [regionId: string]: Star[];
      } = {};

      var allLinks = this.getAllLinks();

      for (var i = 0; i < allLinks.length; i++)
      {
        var star = allLinks[i];
        var region = star.region;

        if (!linksByRegion[region])
        {
          linksByRegion[region] = [];
        }

        linksByRegion[region].push(star);
      }

      return linksByRegion;
    }
    severLinksToRegion(regionToSever: string)
    {
      var linksByRegion = this.getLinksByRegion();
      var links = linksByRegion[regionToSever];

      for (var i = 0; i < links.length; i++)
      {
        var star = links[i];

        this.removeLink(star);
      }
    }
    severLinksToFiller()
    {
      var linksByRegion = this.getLinksByRegion();
      var fillerRegions = Object.keys(linksByRegion).filter(function(region)
      {
        return region.indexOf("filler") >= 0;
      });

      for (var i = 0; i < fillerRegions.length; i++)
      {
        this.severLinksToRegion(fillerRegions[i]);      
      }
    }
    severLinksToNonCenter()
    {
      var self = this;

      var linksByRegion = this.getLinksByRegion();
      var nonCenterRegions = Object.keys(linksByRegion).filter(function(region)
      {
        return region !== self.region && region !== "center";
      });

      for (var i = 0; i < nonCenterRegions.length; i++)
      {
        this.severLinksToRegion(nonCenterRegions[i]);      
      }
    }
    getNeighbors(): Star[]
    {
      var neighbors: Star[] = [];

      for (var i = 0; i < this.voronoiCell.halfedges.length; i++)
      {
        var edge = this.voronoiCell.halfedges[i].edge;

        if (edge.lSite !== null && edge.lSite.id !== this.id)
        {
          neighbors.push(edge.lSite);
        }
        else if (edge.rSite !== null && edge.rSite.id !== this.id)
        {
          neighbors.push(edge.rSite);
        }
      }

      return neighbors;
    }
    getLinkedInRange(range: number)
    {
      if (this.indexedNeighborsInRange[range])
      {
        return this.indexedNeighborsInRange[range];
      }

      var visited:
      {
        [id: number]: Star;
      } = {};
      var visitedByRange:
      {
        [range: number]: Star[];
      } = {};

      visited[this.id] = this;
      visitedByRange[0] = [this];

      var current = [];
      var frontier: Star[] = [this];

      for (var i = 0; i < range; i++)
      {
        current = frontier.slice(0);
        frontier = [];
        visitedByRange[i+1] = [];

        for (var j = 0; j < current.length; j++)
        {
          var neighbors = current[j].getAllLinks();

          for (var k = 0; k < neighbors.length; k++)
          {
            if (visited[neighbors[k].id]) continue;

            visited[neighbors[k].id] = neighbors[k];
            visitedByRange[i+1].push(neighbors[k]);
            frontier.push(neighbors[k]);
          }
        }
      }
      var allVisited = [];

      for (var id in visited)
      {
        allVisited.push(visited[id]);
      }

      this.indexedNeighborsInRange[range] =
      {
        all: allVisited,
        byRange: visitedByRange
      }

      return(
      {
        all: allVisited,
        byRange: visitedByRange
      });

    }
    getVisionRange(): number
    {
      // TODO
      return 1;
    }
    getVision(): Star[]
    {
      return this.getLinkedInRange(this.getVisionRange()).all;
    }
    severLinksToNonAdjacent()
    {
      var allLinks = this.getAllLinks();

      var neighborVoronoiIds = this.voronoiCell.getNeighborIds();

      for (var i = 0; i < allLinks.length; i++)
      {
        var star = allLinks[i];

        if (neighborVoronoiIds.indexOf(star.voronoiId) < 0)
        {
          this.removeLink(star);
        }
      }
    }
  }
}
