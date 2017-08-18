import app from "./App"; // TODO global
import {activeModuleData} from "./activeModuleData";
import {activePlayer} from "./activePlayer";
import BuildingEffect from "./templateinterfaces/BuildingEffect";
import BuildingTemplate from "./templateinterfaces/BuildingTemplate";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import ResourceTemplate from "./templateinterfaces/ResourceTemplate";
import {TerrainTemplate} from "./templateinterfaces/TerrainTemplate";

import Building from "./Building";
import BuildingUpgradeData from "./BuildingUpgradeData";
import FillerPoint from "./FillerPoint";
import {Fleet} from "./Fleet";
import FleetAttackTarget from "./FleetAttackTarget";
import Manufactory from "./Manufactory";
import Player from "./Player";
import Point from "./Point";
import Unit from "./Unit";
import VoronoiCell from "./VoronoiCell";
import eventManager from "./eventManager";
import idGenerators from "./idGenerators";
import
{
  aStar,
} from "./pathFinding";

import StarBuildingsSaveData from "./savedata/StarBuildingsSaveData";
import StarSaveData from "./savedata/StarSaveData";


// represents single location in game world. see Region for a grouping of these locations
export default class Star implements Point
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

  // set by voronoi library and deleted after mapgen
  // voronoiId: number;
  voronoiCell: VoronoiCell<Star>;

  seed: string;

  name: string;
  owner: Player;

  baseIncome: number;
  resource: ResourceTemplate;

  fleets:
  {
    [playerId: string] : Fleet[];
  } = {};

  buildings:
  {
    [category: string] : Building[];
  } = {};
  buildingsEffect: BuildingEffect;
  buildingsEffectIsDirty: boolean = true;


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

  manufactory: Manufactory;
  public race: RaceTemplate;
  public terrain: TerrainTemplate;

  constructor(props:
  {
    x: number;
    y: number;

    id?: number;
    name?: string;

    race?: RaceTemplate;
    terrain?: TerrainTemplate;
  })
  {
    this.x = props.x;
    this.y = props.y;

    this.id = isFinite(props.id) ? props.id : idGenerators.star++;
    this.name = props.name || "Star " + this.id;

    this.race = props.race;
    this.terrain = props.terrain;
  }
  // TODO 2017.02.27 | move this somewhere else
  /**
   * Recursively gets all neighbors that fulfill the callback condition with specified stars
   */
  public static getIslandForQualifier(
    initialStars: Star[],
    earlyReturnSize: number | null,
    qualifier: (parent: Star, candidate: Star) => boolean,
  ): Star[]
  {
    const visited:
    {
      [starId: number]: boolean;
    } = {};

    const connected:
    {
      [starId: number]: Star;
    } = {};

    let sizeFound = 1;

    const frontier: Star[] = initialStars.slice(0);
    initialStars.forEach(star =>
    {
      visited[star.id] = true;
    });

    while (frontier.length > 0)
    {
      const current = frontier.pop();
      connected[current.id] = current;
      const neighbors = current.getLinkedInRange(1).all;

      for (let i = 0; i < neighbors.length; i++)
      {
        const neighbor = neighbors[i];
        if (visited[neighbor.id])
        {
          continue;
        }

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
        for (let i = 0; i < frontier.length; i++)
        {
          connected[frontier[i].id] = frontier[i];
        }

        break;
      }
    }

    const island: Star[] = [];
    for (let starId in connected)
    {
      island.push(connected[starId]);
    }

    return island;
  }
  // BUILDINGS
  addBuilding(building: Building): void
  {
    if (!this.buildings[building.template.category])
    {
      this.buildings[building.template.category] = [];
    }

    const buildings = this.buildings[building.template.category];

    if (buildings.indexOf(building) >= 0)
    {
      throw new Error("Already has building");
    }

    buildings.push(building);
    this.buildingsEffectIsDirty = true;

    if (building.template.category === "defence")
    {
      this.sortDefenceBuildings();
      eventManager.dispatchEvent("renderLayer", "nonFillerStars", this);
    }
    if (building.template.category === "vision")
    {
      this.owner.updateVisibleStars();
    }

    if (this.owner === activePlayer)
    {
      for (let key in building.template.effect)
      {
        eventManager.dispatchEvent("builtBuildingWithEffect_" + key);
      }
      eventManager.dispatchEvent("humanPlayerBuiltBuilding");
    }
  }
  removeBuilding(building: Building): void
  {
    if (
      !this.buildings[building.template.category] ||
      this.buildings[building.template.category].indexOf(building) < 0
    )
    {
      throw new Error("Location doesn't have building");
    }

    const buildings = this.buildings[building.template.category];

    this.buildings[building.template.category].splice(
      buildings.indexOf(building), 1);
    this.buildingsEffectIsDirty = true;
  }
  sortDefenceBuildings(): void
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

  getSecondaryController(): Player | null
  {
    if (!this.buildings["defence"])
    {
      return null;
    }

    const defenceBuildings = this.buildings["defence"];
    for (let i = 0; i < defenceBuildings.length; i++)
    {
      if (defenceBuildings[i].controller !== this.owner)
      {
        return defenceBuildings[i].controller;
      }
    }

    return null;
  }
  updateController(): void
  {
    if (!this.buildings["defence"]) return;

    const oldOwner = this.owner;
    const newOwner = this.buildings["defence"][0].controller;

    if (oldOwner)
    {
      if (oldOwner === newOwner) return;

      oldOwner.removeStar(this);
    }

    newOwner.addStar(this);
    if (this.manufactory)
    {
      this.manufactory.handleOwnerChange();
    }

    eventManager.dispatchEvent("renderLayer", "nonFillerStars", this);
    eventManager.dispatchEvent("renderLayer", "starOwners", this);
    eventManager.dispatchEvent("renderLayer", "ownerBorders", this);
    // TODO display | update starOwners if secondary controller changes
  }
  updateBuildingsEffect(): void
  {
    const effect: BuildingEffect = {};

    for (let category in this.buildings)
    {
      for (let i = 0; i < this.buildings[category].length; i++)
      {
        const building = this.buildings[category][i];
        building.getEffect(effect);
      }
    }

    this.buildingsEffect = effect;
    this.buildingsEffectIsDirty = false;
  }
  getBuildingsEffect(): BuildingEffect
  {
    if (this.buildingsEffectIsDirty)
    {
      this.updateBuildingsEffect();
    }

    return this.buildingsEffect;
  }
  getEffectWithBuildingsEffect(base: number, effectType: string): number
  {
    let effect = base;
    const buildingsEffect = this.getBuildingsEffect()[effectType];

    if (isFinite(buildingsEffect))
    {
      return effect + buildingsEffect;
    }
    else if (buildingsEffect)
    {
      effect += (buildingsEffect.flat || 0);
      effect *= (isFinite(buildingsEffect.multiplier) ? 1 + buildingsEffect.multiplier : 1);
    }

    return effect;
  }
  getIncome(): number
  {
    return this.getEffectWithBuildingsEffect(this.baseIncome, "income");
  }
  getResourceIncome(): {resource: ResourceTemplate; amount: number;}
  {
    if (!this.resource) return null;

    return(
    {
      resource: this.resource,
      amount: this.getEffectWithBuildingsEffect(0, "resourceIncome"),
    });
  }
  getResearchPoints(): number
  {
    return this.getEffectWithBuildingsEffect(0, "research");
  }
  getAllBuildings(): Building[]
  {
    let buildings: Building[] = [];

    for (let category in this.buildings)
    {
      buildings = buildings.concat(this.buildings[category]);
    }

    return buildings;
  }
  getBuildingsForPlayer(player: Player): Building[]
  {
    const allBuildings = this.getAllBuildings();

    return allBuildings.filter(function(building)
    {
      return building.controller.id === player.id;
    });
  }
  getBuildingsByFamily(buildingTemplate: BuildingTemplate): Building[]
  {
    const propToCheck = buildingTemplate.family ? "family" : "type";

    const categoryBuildings = this.buildings[buildingTemplate.category];
    const buildings: Building[] = [];

    if (categoryBuildings)
    {
      for (let i = 0; i < categoryBuildings.length; i++)
      {
        if (categoryBuildings[i].template[propToCheck] === buildingTemplate[propToCheck])
        {
          buildings.push(categoryBuildings[i]);
        }
      }
    }

    return buildings;
  }
  getBuildableBuildings(): BuildingTemplate[]
  {
    const canBuild: BuildingTemplate[] = [];
    for (let buildingType in activeModuleData.Templates.Buildings)
    {
      const template: BuildingTemplate = activeModuleData.Templates.Buildings[buildingType];
      let alreadyBuilt: Building[];

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
  getBuildingUpgrades(): {[buildingId: number]: BuildingUpgradeData[]}
  {
    const allUpgrades:
    {
      [buildingId: number]: BuildingUpgradeData[];
    } = {};

    const self = this;

    const ownerBuildings = this.getBuildingsForPlayer(this.owner);

    for (let i = 0; i < ownerBuildings.length; i++)
    {
      const building = ownerBuildings[i];
      let upgrades = building.getPossibleUpgrades();

      upgrades = upgrades.filter(function(upgradeData: BuildingUpgradeData)
      {
        const parent = upgradeData.parentBuilding.template;
        const template = upgradeData.template;
        if (parent.type === template.type)
        {
          return true;
        }
        else
        {
          const isSameFamily = (template.family && parent.family === template.family);
          let maxAllowed = template.maxPerType;
          if (isSameFamily)
          {
            maxAllowed += 1;
          }
          const alreadyBuilt = self.getBuildingsByFamily(template);
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
  // FLEETS
  public getFleets(playerFilter?: (player: Player) => boolean): Fleet[]
  {
    const allFleets: Fleet[] = [];

    for (let playerId in this.fleets)
    {
      const playerFleets = this.fleets[playerId];
      if (playerFleets.length > 0)
      {
        const player = this.fleets[playerId][0].player;
        if (!playerFilter || playerFilter(player) === true)
        {
          allFleets.push(...playerFleets);
        }
      }
    }

    return allFleets;
  }
  public getUnits(playerFilter?: (player: Player) => boolean): Unit[]
  {
    const fleets = this.getFleets(playerFilter);
    const units: Unit[] = [];

    fleets.forEach(fleet =>
    {
      units.push(...fleet.units);
    });

    return units;
  }
  public getFleetOwners(): Player[]
  {
    const fleetOwners: Player[] = [];

    for (let playerId in this.fleets)
    {
      if (this.fleets[playerId].length > 0)
      {
        fleetOwners.push(this.fleets[playerId][0].player);
      }
    }

    return fleetOwners;
  }
  getFleetIndex(fleet: Fleet): number
  {
    if (!this.fleets[fleet.player.id]) return -1;

    return this.fleets[fleet.player.id].indexOf(fleet);
  }
  hasFleet(fleet: Fleet): boolean
  {
    return this.getFleetIndex(fleet) >= 0;
  }
  addFleet(fleet: Fleet): void
  {
    if (!this.fleets[fleet.player.id])
    {
      this.fleets[fleet.player.id] = [];
    }

    if (this.hasFleet(fleet))
    {
      throw new Error(`Star ${this.name} already has fleet ${fleet.name}`);
    }

    fleet.location = this;
    this.fleets[fleet.player.id].push(fleet);
  }
  removeFleet(fleet: Fleet): void
  {
    const fleetIndex = this.getFleetIndex(fleet);

    if (fleetIndex < 0)
    {
      throw new Error(`Star ${this.name} doesn't have fleet ${fleet.name}`);
    }

    this.fleets[fleet.player.id].splice(fleetIndex, 1);

    if (this.fleets[fleet.player.id].length === 0)
    {
      delete this.fleets[fleet.player.id];
    }
  }
  getTargetsForPlayer(player: Player): FleetAttackTarget[]
  {
    const buildingTarget = this.getFirstEnemyDefenceBuilding(player);
    const buildingController = buildingTarget ? buildingTarget.controller : null;

    const diplomacyStatus = player.diplomacyStatus;

    const targets: FleetAttackTarget[] = [];

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
        units: this.getUnits(player => player === buildingTarget.controller),
      });
    }

    const hostileFleetOwners = this.getFleetOwners().filter(fleetOwner =>
    {
      if (fleetOwner === buildingController)
      {
        return false;
      }
      else
      {
        return player.diplomacyStatus.canAttackFleetOfPlayer(fleetOwner);
      }
    });

    for (let i = 0; i < hostileFleetOwners.length; i++)
    {
      if (diplomacyStatus.canAttackFleetOfPlayer(hostileFleetOwners[i]))
      {
        targets.push(
        {
          type: "fleet",
          enemy: hostileFleetOwners[i],
          building: null,
          units: this.getUnits(player => player === hostileFleetOwners[i]),
        });
      }
    }

    return targets;
  }
  public hasBuildingTargetForPlayer(player: Player): boolean
  {
    return this.getTargetsForPlayer(player).some(target =>
    {
      return target.type === "building";
    });
  }
  getFirstEnemyDefenceBuilding(player: Player): Building
  {
    if (!this.buildings["defence"])
    {
      return null;
    }

    let defenceBuildings = this.buildings["defence"].slice(0);
    if (this.owner === player)
    {
      defenceBuildings = defenceBuildings.reverse();
    }

    for (let i = defenceBuildings.length - 1; i >= 0; i--)
    {
      if (defenceBuildings[i].controller.id !== player.id)
      {
        return defenceBuildings[i];
      }
    }

    return null;
  }

  // MAP GEN
  setResource(resource: ResourceTemplate): void
  {
    this.resource = resource;
  }
  hasLink(linkTo: Star): boolean
  {
    return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
  }
  // could maybe use adding / removing links as a gameplay mechanic
  addLink(linkTo: Star): void
  {
    if (this.hasLink(linkTo)) return;

    this.linksTo.push(linkTo);
    linkTo.linksFrom.push(this);
  }
  removeLink(linkTo: Star, removeOpposite: boolean = true): void
  {
    if (!this.hasLink(linkTo))
    {
      throw new Error("Tried to remove nonexistant link between stars: " + this.id + " <-> " + linkTo.id);
    }

    const toIndex = this.linksTo.indexOf(linkTo);
    if (toIndex >= 0)
    {
      this.linksTo.splice(toIndex, 1);
    }
    else
    {
      this.linksFrom.splice(this.linksFrom.indexOf(linkTo), 1);
    }

    if (removeOpposite)
    {
      linkTo.removeLink(this, false);
    }
  }
  getAllLinks(): Star[]
  {
    return this.linksTo.concat(this.linksFrom);
  }
  getEdgeWith(neighbor: Star): Voronoi.Edge<Star>
  {
    for (let i = 0; i < this.voronoiCell.halfedges.length; i++)
    {
      const edge = this.voronoiCell.halfedges[i].edge;

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
  getSharedNeighborsWith(neighbor: Star): (Star | FillerPoint)[]
  {
    const ownNeighbors = this.getNeighbors();
    const neighborNeighbors = neighbor.getNeighbors();

    const sharedNeighbors: Array<Star | FillerPoint> = [];

    for (let i = 0; i < ownNeighbors.length; i++)
    {
      const star = ownNeighbors[i];
      if (star !== neighbor && neighborNeighbors.indexOf(star) !== -1)
      {
        sharedNeighbors.push(star);
      }
    }

    return sharedNeighbors;
  }
  // return adjacent stars whether they're linked to this or not
  getNeighbors(): (Star | FillerPoint)[]
  {
    const neighbors: (Star | FillerPoint)[] = [];

    for (let i = 0; i < this.voronoiCell.halfedges.length; i++)
    {
      const edge = <Voronoi.Edge<Star>> this.voronoiCell.halfedges[i].edge;

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
  public getAllLinkedStars(): Star[]
  {
    return this.getLinkedInRange(99999).all;
  }
  getLinkedInRange(range: number)
  {
    if (this.indexedNeighborsInRange[range])
    {
      return this.indexedNeighborsInRange[range];
    }

    const visited:
    {
      [id: number]: Star;
    } = {};
    const visitedByRange:
    {
      [range: number]: Star[];
    } = {};

    if (range >= 0)
    {
      visited[this.id] = this;
    }

    let current: Star[] = [];
    let frontier: Star[] = [this];

    for (let i = 0; i < range; i++)
    {
      current = frontier.slice(0);
      if (current.length <= 0) break;
      frontier = [];
      visitedByRange[i+1] = [];

      for (let j = 0; j < current.length; j++)
      {
        const neighbors = current[j].getAllLinks();

        for (let k = 0; k < neighbors.length; k++)
        {
          if (visited[neighbors[k].id]) continue;

          visited[neighbors[k].id] = neighbors[k];
          visitedByRange[i+1].push(neighbors[k]);
          frontier.push(neighbors[k]);
          this.indexedDistanceToStar[neighbors[k].id] = i;
        }
      }
    }
    const allVisited: Star[] = [];

    for (let id in visited)
    {
      allVisited.push(visited[id]);
    }

    this.indexedNeighborsInRange[range] =
    {
      all: allVisited,
      byRange: visitedByRange,
    };

    return(
    {
      all: allVisited,
      byRange: visitedByRange,
    });
  }
  getNearestStarForQualifier(qualifier: (star: Star) => boolean): Star
  {
    if (qualifier(this)) return this;


    const visited:
    {
      [starId: number]: boolean;
    } = {};


    const frontier: Star[] = [this];
    visited[this.id] = true;

    while (frontier.length > 0)
    {
      const current = frontier.shift();
      const neighbors = current.getLinkedInRange(1).all;

      for (let i = 0; i < neighbors.length; i++)
      {
        const neighbor = neighbors[i];
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
  getDistanceToStar(target: Star): number
  {
    // don't index distance while generating map as distance can change
    if (!app.game)
    {
      const a = aStar(this, target);
      return a.cost[target.id];
    }

    if (!this.indexedDistanceToStar[target.id])
    {
      const a = aStar(this, target);
      if (!a)
      {
        this.indexedDistanceToStar[target.id] = -1;
      }
      else
      {
        for (let id in a.cost)
        {
          this.indexedDistanceToStar[id] = a.cost[id];
        }
      }
    }

    return this.indexedDistanceToStar[target.id];
  }
  getVisionRange(): number
  {
    return this.getEffectWithBuildingsEffect(1, "vision");
  }
  getVision(): Star[]
  {
    return this.getLinkedInRange(this.getVisionRange()).all;
  }
  getDetectionRange(): number
  {
    return this.getEffectWithBuildingsEffect(0, "detection");
  }
  getDetection(): Star[]
  {
    return this.getLinkedInRange(this.getDetectionRange()).all;
  }
  getHealingFactor(player: Player): number
  {
    let factor = 0;

    if (player === this.owner)
    {
      factor += 0.15;
    }

    return factor;
  }
  getPresentPlayersByVisibility()
  {
    const byVisibilityAndId:
    {
      visible:
      {
        [playerId: number]: Player;
      }
      stealthy:
      {
        [playerId: number]: Player;
      }
      all:
      {
        [playerId: number]: Player;
      },
    } =
    {
      visible: {},
      stealthy: {},
      all: {},
    };

    byVisibilityAndId.visible[this.owner.id] = this.owner;
    const secondaryController = this.getSecondaryController();
    if (secondaryController)
    {
      byVisibilityAndId.visible[secondaryController.id] = secondaryController;
    }

    for (let playerId in this.fleets)
    {
      const fleets = this.fleets[playerId];
      for (let i = 0; i < fleets.length; i++)
      {
        const fleetPlayer = fleets[i].player;
        if (byVisibilityAndId.stealthy[fleetPlayer.id] && byVisibilityAndId.visible[fleetPlayer.id])
        {
          break;
        }
        byVisibilityAndId.all[fleetPlayer.id] = fleetPlayer;
        if (fleets[i].isStealthy)
        {
          byVisibilityAndId.stealthy[fleetPlayer.id] = fleetPlayer;
        }
        else
        {
          byVisibilityAndId.visible[fleetPlayer.id] = fleetPlayer;
        }
      }
    }

    return byVisibilityAndId;
  }
  getSeed(): string
  {
    if (!this.seed)
    {
      let bgString = "";
      bgString += Math.round(this.x);
      bgString += Math.round(this.y);
      bgString += new Date().getTime();
      this.seed = bgString;
    }

    return this.seed;
  }
  buildManufactory(): void
  {
    this.manufactory = new Manufactory(this);
  }
  serialize(): StarSaveData
  {
    const buildings: StarBuildingsSaveData = {};

    for (let category in this.buildings)
    {
      buildings[category] = [];
      for (let i = 0; i < this.buildings[category].length; i++)
      {
        buildings[category].push(this.buildings[category][i].serialize());
      }
    }


    const data: StarSaveData =
    {
      id: this.id,
      x: this.basisX,
      y: this.basisY,

      baseIncome: this.baseIncome,

      name: this.name,
      ownerId: this.owner ? this.owner.id : null,

      linksToIds: this.linksTo.map(function(star){return star.id;}),
      linksFromIds: this.linksFrom.map(function(star){return star.id;}),

      seed: this.seed,

      buildings: buildings,

      raceType: this.race.type,
      terrainType: this.terrain.type,
    };

    if (this.resource)
    {
      data.resourceType = this.resource.type;
    }

    if (this.manufactory)
    {
      data.manufactory = this.manufactory.serialize();
    }

    return data;
  }
}
