/// <reference path="../modules/default/templates/resources.ts" />

/// <reference path="point.ts" />
/// <reference path="player.ts" />
/// <reference path="fleet.ts" />
/// <reference path="building.ts" />

/// <reference path="itemgenerator.ts" />

module Rance
{

  export class Star implements Point
  {
    id: number;
    x: number;
    y: number;

    // position voronoi cell is calculated from. after voronoi is calculated, star is moved
    // to the centroid of its cell and these are stored to calculate voronoi after loading map
    basisX: number;
    basisY: number;

    // separated so we can iterate through star[].linksTo to only get each connection once
    // use star.getAllLinks() for individual star connections
    linksTo: Star[] = [];
    linksFrom: Star[] = [];

    // can be used during map gen to attach temporary variables for easier debugging
    // nulled and deleted after map gen is done
    mapGenData: any = {};
    // set by voronoi library and deleted after mapgen
    voronoiId: number;

    seed: string;

    name: string;
    owner: Player;

    baseIncome: number;
    resource: Templates.IResourceTemplate;
    
    fleets:
    {
      [playerId: string] : Fleet[];
    } = {};

    buildings:
    {
      [category: string] : Building[];
    } = {};

    voronoiCell: any;

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
    indexedDistanceToStar:
    {
      [id: number]: number;
    } = {};

    // TODO rework items building
    buildableItems:
    {
      1: Templates.IItemTemplate[];
      2: Templates.IItemTemplate[];
      3: Templates.IItemTemplate[];
    } =
    {
      1: [],
      2: [],
      3: []
    };
    buildableUnitTypes: Templates.IUnitTemplate[] = [];

    constructor(x: number, y: number, id?: number)
    {
      this.id = isFinite(id) ? id : idGenerators.star++;
      this.name = "Star " + this.id;

      this.x = x;
      this.y = y;
    }
    // TODO REMOVE
    severLinksToNonAdjacent()
    {
      var allLinks = this.getAllLinks();

      var neighborVoronoiIds = this.voronoiCell.getNeighborIds();

      for (var i = 0; i < allLinks.length; i++)
      {
        var star = allLinks[i];

        if (neighborVoronoiIds.indexOf(star.voronoiId) === -1)
        {
          this.removeLink(star);
        }
      }
    }
    // END TO REMOVE

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
        this.sortDefenceBuildings();
        eventManager.dispatchEvent("renderLayer", "nonFillerStars", this);
      }
      if (building.template.category === "vision")
      {
        this.owner.updateVisibleStars();
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

      this.buildings[building.template.category].splice(
        buildings.indexOf(building), 1);
    }
    sortDefenceBuildings()
    {
      this.buildings["defence"].sort(function(a, b)
      {
        if (a.template.maxPerType === 1) //hq
        {
          return -1;
        }
        else if (b.template.maxPerType === 1)
        {
          return 1;
        }

        if (a.upgradeLevel !== b.upgradeLevel)
        {
          return b.upgradeLevel - a.upgradeLevel;
        }

        return a.id - b.id;
      });
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
      if (!this.buildings["defence"]) return;

      var oldOwner = this.owner;
      var newOwner = this.buildings["defence"][0].controller;

      if (oldOwner)
      {
        if (oldOwner === newOwner) return;

        oldOwner.removeStar(this);
      }

      newOwner.addStar(this);

      eventManager.dispatchEvent("renderLayer", "nonFillerStars", this);
      eventManager.dispatchEvent("renderLayer", "starOwners", this);
      eventManager.dispatchEvent("renderLayer", "ownerBorders", this);
    }
    getIncome()
    {
      var tempBuildingIncome = 0;
      if (this.buildings["economy"])
      {
        for (var i = 0; i < this.buildings["economy"].length; i++)
        {
          var building = this.buildings["economy"][i];
          tempBuildingIncome += building.upgradeLevel * 20;
        }
      }
      return this.baseIncome + tempBuildingIncome;
    }
    getResourceIncome()
    {
      if (!this.resource || !this.buildings["mine"]) return null;
      else
      {
        return(
        {
          resource: this.resource,
          amount: this.buildings["mine"].length
        });
      }
      
    }
    getAllBuildings()
    {
      var buildings: Building[] = [];

      for (var category in this.buildings)
      {
        buildings = buildings.concat(this.buildings[category]);
      }

      return buildings;
    }
    getBuildingsForPlayer(player: Player)
    {
      var allBuildings = this.getAllBuildings();

      return allBuildings.filter(function(building)
      {
        return building.controller.id === player.id;
      });
    }
    getBuildingsByFamily(buildingTemplate: Templates.IBuildingTemplate): Building[]
    {
      var propToCheck = buildingTemplate.family ? "family" : "type";

      var categoryBuildings = this.buildings[buildingTemplate.category];
      var buildings: Building[] = [];

      if (categoryBuildings)
      {
        for (var i = 0; i < categoryBuildings.length; i++)
        {
          if (categoryBuildings[i].template[propToCheck] === buildingTemplate[propToCheck])
          {
            buildings.push(categoryBuildings[i]);
          }
        }
      }

      return buildings;
    }
    getBuildableBuildings()
    {
      var canBuild: Templates.IBuildingTemplate[] = [];
      for (var buildingType in app.moduleData.Templates.Buildings)
      {
        var template: Templates.IBuildingTemplate = app.moduleData.Templates.Buildings[buildingType];
        var alreadyBuilt: Building[];
        
        if (template.category === "mine" && !this.resource)
        {
          continue;
        }

        alreadyBuilt = this.getBuildingsByFamily(template);

        if (alreadyBuilt.length < template.maxPerType && !template.upgradeOnly)
        {
          canBuild.push(template);
        }
      }

      return canBuild;
    }
    getBuildingUpgrades()
    {
      var allUpgrades:
      {
        [buildingId: number]:
        {
          template: Templates.IBuildingTemplate;
          level: number;
          cost: number;
          parentBuilding: Building;
        }[];
      } = {};

      var self = this;

      var ownerBuildings = this.getBuildingsForPlayer(this.owner);

      for (var i = 0; i < ownerBuildings.length; i++)
      {
        var building = ownerBuildings[i];
        var upgrades = building.getPossibleUpgrades();

        upgrades = upgrades.filter(function(upgradeData: IBuildingUpgradeData)
        {
          var parent = upgradeData.parentBuilding.template;
          var template = upgradeData.template;
          if (parent.type === template.type)
          {
            return true;
          }
          else
          {
            var isSameFamily = (template.family && parent.family === template.family);
            var maxAllowed = template.maxPerType;
            if (isSameFamily)
            {
              maxAllowed += 1;
            }
            var alreadyBuilt = self.getBuildingsByFamily(template);
            return alreadyBuilt.length < maxAllowed;
          }
        });

        if (upgrades.length > 0)
        {
          allUpgrades[building.id] = upgrades;
        }

      }

      return allUpgrades;
    }

    getBuildableShipTypes()
    {
      return this.owner.getGloballyBuildableShips().concat(this.buildableUnitTypes);
    }

    // FLEETS
    getAllFleets()
    {
      var allFleets: Fleet[] = [];

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

      if (this.fleets[fleet.player.id].length === 0)
      {
        delete this.fleets[fleet.player.id];
      }
    }
    removeFleets(fleets: Fleet[])
    {
      for (var i = 0; i < fleets.length; i++)
      {
        this.removeFleet(fleets[i]);
      }
    }
    getAllShipsOfPlayer(player: Player): Unit[]
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
    getIndependentShips(): Unit[]
    {
      var ships: Unit[] = [];

      for (var playerId in this.fleets)
      {
        var player = this.fleets[playerId][0].player;
        if (player.isIndependent)
        {
          ships = ships.concat(this.getAllShipsOfPlayer(player));
        }
      }

      return ships;
    }
    getTargetsForPlayer(player: Player)
    {
      var buildingTarget = this.getFirstEnemyDefenceBuilding(player);
      var buildingController = buildingTarget ? buildingTarget.controller : null;
      var fleetOwners = this.getEnemyFleetOwners(player, buildingController);

      var diplomacyStatus = player.diplomacyStatus;

      var targets:
      {
        type: string;
        enemy: Player;
        building: Building;
        ships: Unit[]
      }[] = [];

      if (buildingTarget &&
        (
          player === this.owner ||
          diplomacyStatus.canAttackBuildingOfPlayer(buildingTarget.controller)
        )
      )
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
        if (diplomacyStatus.canAttackFleetOfPlayer(fleetOwners[i]))
        {
          targets.push(
          {
            type: "fleet",
            enemy: fleetOwners[i],
            building: null,
            ships: this.getAllShipsOfPlayer(fleetOwners[i])
          });
        }
      }

      return targets;
    }
    getFirstEnemyDefenceBuilding(player: Player): Building
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
    getEnemyFleetOwners(player: Player, excludedTarget?: Player): Player[]
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
    setResource(resource: Templates.IResourceTemplate)
    {
      this.resource = resource;
    }
    hasLink(linkTo: Star)
    {
      return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
    }
    // could maybe use adding / removing links as a gameplay mechanic
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
    getEdgeWith(neighbor: Star)
    {
      for (var i = 0; i < this.voronoiCell.halfedges.length; i++)
      {
        var edge = this.voronoiCell.halfedges[i].edge;

        if (
          (edge.lSite && edge.lSite === neighbor) ||
          (edge.rSite && edge.rSite === neighbor)
        )
        {
          return edge;
        }
      }

      return null;
    }
    getSharedNeighborsWith(neighbor: Star)
    {
      var ownNeighbors = this.getNeighbors();
      var neighborNeighbors = neighbor.getNeighbors();

      var sharedNeighbors: Star[] = [];

      for (var i = 0; i < ownNeighbors.length; i++)
      {
        var star = ownNeighbors[i];
        if (star !== neighbor && neighborNeighbors.indexOf(star) !== -1)
        {
          sharedNeighbors.push(star);
        }
      }

      return sharedNeighbors;
    }
    // return adjacent stars whether they're linked to this or not
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

      if (range >= 0)
      {
        visited[this.id] = this;
      }

      var current: Star[] = [];
      var frontier: Star[] = [this];

      for (var i = 0; i < range; i++)
      {
        current = frontier.slice(0);
        if (current.length <= 0) break;
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
            this.indexedDistanceToStar[neighbors[k].id] = i;
          }
        }
      }
      var allVisited: Star[] = [];

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
    // Recursively gets all neighbors that fulfill the callback condition with this star
    // Optional earlyReturnSize parameter returns if an island of specified size is found
    getIslandForQualifier(qualifier: (starA: Star, starB: Star) => boolean,
      earlyReturnSize?: number): Star[]
    {
      var visited:
      {
        [starId: number]: boolean;
      } = {};

      var connected:
      {
        [starId: number]: Star;
      } = {};

      var sizeFound = 1;

      var initialStar = this;
      var frontier: Star[] = [initialStar];
      visited[initialStar.id] = true;

      while (frontier.length > 0)
      {
        var current = frontier.pop();
        connected[current.id] = current;
        var neighbors = current.getLinkedInRange(1).all;
        
        for (var i = 0; i < neighbors.length; i++)
        {
          var neighbor = neighbors[i];
          if (visited[neighbor.id]) continue;

          visited[neighbor.id] = true;
          if (qualifier(current, neighbor))
          {
            sizeFound++;
            frontier.push(neighbor);
          }
        }
        // breaks when sufficiently big island has been found
        if (earlyReturnSize && sizeFound >= earlyReturnSize)
        {
          for (var i = 0; i < frontier.length; i++)
          {
            connected[frontier[i].id] = frontier[i];
          }

          break;
        }
      }

      var island: Star[] = [];
      for (var starId in connected)
      {
        island.push(connected[starId]);
      }

      return island;
    }
    getNearestStarForQualifier(qualifier: (star: Star) => boolean)
    {
      if (qualifier(this)) return this;

      
      var visited:
      {
        [starId: number]: boolean;
      } = {};


      var frontier: Star[] = [this];
      visited[this.id] = true;

      while (frontier.length > 0)
      {
        var current = frontier.pop();
        var neighbors = current.getLinkedInRange(1).all;

        for (var i = 0; i < neighbors.length; i++)
        {
          var neighbor = neighbors[i];
          if (visited[neighbor.id]) continue;

          visited[neighbor.id] = true;

          if (qualifier(neighbor))
          {
            return neighbor;
          }
          else
          {
            frontier.push(neighbor);
          }
        }
      }

      return null;
    }
    getDistanceToStar(target: Star)
    {
      if (!this.indexedDistanceToStar[target.id])
      {
        var a = aStar(this, target);
        if (!a)
        {
          this.indexedDistanceToStar[target.id] = -1;
        }
        else
        {
          for (var id in a.cost)
          {
            this.indexedDistanceToStar[id] = a.cost[id];
          }
        }
      }

      return this.indexedDistanceToStar[target.id];
    }
    getVisionRange(): number
    {
      var baseVision = 1;

      if (this.buildings["vision"])
      {
        for (var i = 0; i < this.buildings["vision"].length; i++)
        {
          baseVision += this.buildings["vision"][i].upgradeLevel;
        }
      }

      return baseVision;
    }
    getVision(): Star[]
    {
      return this.getLinkedInRange(this.getVisionRange()).all;
    }
    getDetectionRange(): number
    {
      // TODO detection buildings
      return 0;
    }
    getDetection(): Star[]
    {
      return this.getLinkedInRange(this.getDetectionRange()).all;
    }
    getHealingFactor(player: Player): number
    {
      var factor = 0;

      if (player === this.owner)
      {
        factor += 0.15;
      }

      return factor;
    }
    getSeed()
    {
      if (!this.seed)
      {
        var bgString = "";
        bgString += Math.round(this.x);
        bgString += Math.round(this.y);
        bgString += new Date().getTime();
        this.seed = bgString;
      }

      return this.seed;
    }
    
    seedBuildableItems()
    {
      for (var techLevel in this.buildableItems)
      {
        var itemsByTechLevel = app.itemGenerator.itemsByTechLevel[techLevel];

        var maxItemsForTechLevel = this.getItemAmountForTechLevel(techLevel, 999);

        itemsByTechLevel = shuffleArray(itemsByTechLevel, this.getSeed());

        for (var i = 0; i < maxItemsForTechLevel; i++)
        {
          this.buildableItems[techLevel].push(itemsByTechLevel.pop());
        }
      }
    }
    getItemManufactoryLevel()
    {
      var level = 0;
      if (this.buildings["manufactory"])
      {
        for (var i = 0; i < this.buildings["manufactory"].length; i++)
        {
          level += this.buildings["manufactory"][i].upgradeLevel;
        }
      }

      return level;
    }
    getItemAmountForTechLevel(techLevel: number, manufactoryLevel: number)
    {
      var maxManufactoryLevel = 3; // MANUFACTORY_MAX

      manufactoryLevel = clamp(manufactoryLevel, 0, maxManufactoryLevel);

      var amount = (1 + manufactoryLevel) - techLevel;

      if (amount < 0) amount = 0;

      return amount;
    }
    getBuildableItems()
    {
      if (!this.buildableItems[1] || this.buildableItems[1].length < 1)
      {
        this.seedBuildableItems();
      };

      var manufactoryLevel = this.getItemManufactoryLevel();

      var byTechLevel:
      {
        [techLevel: number]: Templates.IItemTemplate[];
      } = {};
      var allBuildable: Templates.IItemTemplate[] = [];

      for (var techLevel in this.buildableItems)
      {
        var amountBuildable = this.getItemAmountForTechLevel(techLevel, manufactoryLevel)
        var forThisTechLevel = this.buildableItems[techLevel].slice(0, amountBuildable);

        byTechLevel[techLevel] = forThisTechLevel;
        allBuildable = allBuildable.concat(forThisTechLevel);
      }

      return(
      {
        byTechLevel: byTechLevel,
        all: allBuildable
      })
    }
    serialize()
    {
      var data: any = {};

      data.id = this.id;
      data.x = this.basisX;
      data.y = this.basisY;

      data.baseIncome = this.baseIncome;

      data.name = this.name;
      data.ownerId = this.owner ? this.owner.id : null;

      data.linksToIds = this.linksTo.map(function(star){return star.id});
      data.linksFromIds = this.linksFrom.map(function(star){return star.id});

      data.seed = this.seed;
      if (this.resource)
      {
        data.resourceType = this.resource.type;
      }

      data.buildableUnitTypes = this.buildableUnitTypes.map(function(template)
      {
        return template.type;
      });

      data.buildings = {};

      for (var category in this.buildings)
      {
        data.buildings[category] = [];
        for (var i = 0; i < this.buildings[category].length; i++)
        {
          data.buildings[category].push(this.buildings[category][i].serialize())
        }
      }

      return data;
    }
  }
}
