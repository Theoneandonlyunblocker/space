import app from "./App"; // TODO global
import {activeModuleData} from "./activeModuleData";
import {activePlayer} from "./activePlayer";
import {BuildingTemplate} from "./templateinterfaces/BuildingTemplate";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import ResourceTemplate from "./templateinterfaces/ResourceTemplate";
import {TerrainTemplate} from "./templateinterfaces/TerrainTemplate";

import {Building, TerritoryBuilding} from "./Building";
import {BuildingCollection} from "./BuildingCollection";
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

import StarSaveData from "./savedata/StarSaveData";
import { applyFlatAndMultiplierAdjustments } from "./FlatAndMultiplierAdjustment";
import GalaxyMap from "./GalaxyMap";


// represents single location in game world. see Region for a grouping of these locations
export default class Star implements Point
{
  public readonly id: number;
  public readonly seed: string;
  public readonly x: number;
  public readonly y: number;

  // position voronoi cell is calculated from
  // after voronoi is calculated, star is moved to the centroid of its cell
  // these are stored to calculate voronoi after loading map
  public basisX: number;
  public basisY: number;

  // separated so we can iterate through star[].linksTo to only get each connection once
  // use star.getAllLinks() for individual star connections
  public readonly linksTo: Star[] = [];
  public readonly linksFrom: Star[] = [];

  public voronoiCell: VoronoiCell<Star>;

  public name: string;
  public owner: Player;
  public baseIncome: number;
  public resource: ResourceTemplate;
  public race: RaceTemplate;
  public terrain: TerrainTemplate;

  public readonly fleets:
  {
    [playerId: string]: Fleet[];
  } = {};

  public galaxyMap: GalaxyMap;
  public readonly buildings: BuildingCollection<Building>;
  public readonly territoryBuildings: BuildingCollection<TerritoryBuilding>;
  public manufactory: Manufactory;

  private readonly indexedNeighborsInRange:
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
  private readonly indexedDistanceToStar:
  {
    [id: number]: number;
  } = {};

  constructor(props:
  {
    x: number;
    y: number;

    id?: number;
    seed?: string;
    name?: string;

    race?: RaceTemplate;
    terrain?: TerrainTemplate;
  })
  {
    this.x = props.x;
    this.y = props.y;

    this.id = isFinite(props.id) ? props.id : idGenerators.star++;
    this.seed = props.seed || this.generateSeedString();
    this.name = props.name || `Star ${this.id}`;

    this.race = props.race;
    this.terrain = props.terrain;

    this.territoryBuildings = new BuildingCollection(building =>
    {
      if (isFinite(building.template.maxBuiltGlobally))
      {
        this.galaxyMap.registerGloballyLimitedBuilding(building);
      }

      eventManager.dispatchEvent("renderLayer", "nonFillerStars", this);
    });

    this.buildings = new BuildingCollection(building =>
    {
      if (isFinite(building.template.maxBuiltGlobally))
      {
        this.galaxyMap.registerGloballyLimitedBuilding(building);
      }

      const effect = building.getEffect();

      const buildingChangesVision = effect.vision || effect.detection;
      if (buildingChangesVision)
      {
        this.owner.updateVisibleStars();
      }

      if (this.owner === activePlayer)
      {

        for (const key in effect)
        {
          eventManager.dispatchEvent("builtBuildingWithEffect_" + key);
        }
        eventManager.dispatchEvent("humanPlayerBuiltBuilding");
      }
    });
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
    for (const starId in connected)
    {
      island.push(connected[starId]);
    }

    return island;
  }


  public getSecondaryController(): Player | null
  {
    const territoryBuildings = this.getTerritoryBuildings();
    for (let i = 0; i < territoryBuildings.length; i++)
    {
      if (territoryBuildings[i].controller !== this.owner)
      {
        return territoryBuildings[i].controller;
      }
    }

    return null;
  }
  public updateController(): void
  {
    const territoryBuildings = this.getTerritoryBuildings();

    const oldOwner = this.owner;
    const newOwner = territoryBuildings[0].controller;

    if (oldOwner)
    {
      if (oldOwner === newOwner)
      {
        return;
      }
      else
      {
        oldOwner.removeStar(this);
      }
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
  // // TODO 2018.06.05 | baleet
  // private getEffectWithBuildingsEffect(base: number, effectType: string): number
  // {
  //   let effect = base;
  //   const buildingsEffect = this.getBuildingsEffect()[effectType];

  //   if (isFinite(buildingsEffect))
  //   {
  //     return effect + buildingsEffect;
  //   }
  //   else if (buildingsEffect)
  //   {
  //     effect += (buildingsEffect.flat || 0);
  //     effect *= (isFinite(buildingsEffect.multiplier) ? 1 + buildingsEffect.multiplier : 1);
  //   }

  //   return effect;
  // }
  public getIncome(): number
  {
    const buildingsEffect = this.buildings.getEffects().income;

    return applyFlatAndMultiplierAdjustments(this.baseIncome, buildingsEffect);
  }
  public getResearchPoints(): number
  {
    const basePoints = activeModuleData.ruleSet.research.baseResearchPointsPerStar;
    const buildingsEffect = this.buildings.getEffects().researchPoints;

    return applyFlatAndMultiplierAdjustments(basePoints, buildingsEffect);
  }
  public getResourceIncome(): {resource: ResourceTemplate; amount: number} | null
  {
    if (!this.resource)
    {
      return null;
    }

    const baseAmount = 0;
    const buildingsEffect = this.buildings.getEffects().resourceIncome;

    const finalAmount = applyFlatAndMultiplierAdjustments(baseAmount, buildingsEffect)

    return(
    {
      resource: this.resource,
      amount: finalAmount,
    });
  }

  // FLEETS
  public getFleets(playerFilter?: (player: Player) => boolean): Fleet[]
  {
    const allFleets: Fleet[] = [];

    for (const playerId in this.fleets)
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

    for (const playerId in this.fleets)
    {
      if (this.fleets[playerId].length > 0)
      {
        fleetOwners.push(this.fleets[playerId][0].player);
      }
    }

    return fleetOwners;
  }
  private getFleetIndex(fleet: Fleet): number
  {
    if (!this.fleets[fleet.player.id]) { return -1; }

    return this.fleets[fleet.player.id].indexOf(fleet);
  }
  private hasFleet(fleet: Fleet): boolean
  {
    return this.getFleetIndex(fleet) !== -1;
  }
  public addFleet(fleet: Fleet): void
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
  public removeFleet(fleet: Fleet): void
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
  public getTargetsForPlayer(player: Player): FleetAttackTarget[]
  {
    const buildingTarget = this.getFirstEnemyTerritoryBuilding(player);
    const buildingController = buildingTarget ? buildingTarget.controller : null;

    const targets: FleetAttackTarget[] = [];

    if (buildingTarget && player.diplomacy.canAttackBuildingOfPlayer(buildingTarget.controller))
    {
      targets.push(
      {
        type: "building",
        enemy: buildingTarget.controller,
        building: buildingTarget,
        units: this.getUnits(unitOwner => unitOwner === buildingTarget.controller),
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
        return player.diplomacy.canAttackFleetOfPlayer(fleetOwner);
      }
    });

    for (let i = 0; i < hostileFleetOwners.length; i++)
    {
      if (player.diplomacy.canAttackFleetOfPlayer(hostileFleetOwners[i]))
      {
        targets.push(
        {
          type: "fleet",
          enemy: hostileFleetOwners[i],
          building: null,
          units: this.getUnits(unitOwner => unitOwner === hostileFleetOwners[i]),
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
  private getFirstEnemyTerritoryBuilding(player: Player): TerritoryBuilding
  {
    const territoryBuildings = this.getTerritoryBuildings();

    if (this.owner === player)
    {
      territoryBuildings.reverse();
    }

    for (let i = territoryBuildings.length - 1; i >= 0; i--)
    {
      if (territoryBuildings[i].controller.id !== player.id)
      {
        return territoryBuildings[i];
      }
    }

    return null;
  }

  // MAP GEN
  public hasLink(linkTo: Star): boolean
  {
    return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
  }
  // could maybe use adding / removing links as a gameplay mechanic
  public addLink(linkTo: Star): void
  {
    if (this.hasLink(linkTo)) { return; }

    this.linksTo.push(linkTo);
    linkTo.linksFrom.push(this);
  }
  public removeLink(linkTo: Star, removeOpposite: boolean = true): void
  {
    if (!this.hasLink(linkTo))
    {
      throw new Error(`Tried to remove nonexistant link between stars: ${this.id} <-> ${linkTo.id}`);
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
  public getAllLinks(): Star[]
  {
    return this.linksTo.concat(this.linksFrom);
  }
  public getEdgeWith(neighbor: Star): Voronoi.Edge<Star>
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
  public getSharedNeighborsWith(neighbor: Star): (Star | FillerPoint)[]
  {
    const ownNeighbors = this.getNeighbors();
    const neighborNeighbors = neighbor.getNeighbors();

    const sharedNeighbors: (Star | FillerPoint)[] = [];

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
  // return adjacent points whether they're linked to this or not
  public getNeighbors(): (Star | FillerPoint)[]
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
  public getLinkedInRange(range: number)
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
      if (current.length <= 0) { break; }
      frontier = [];
      visitedByRange[i + 1] = [];

      for (let j = 0; j < current.length; j++)
      {
        const neighbors = current[j].getAllLinks();

        for (let k = 0; k < neighbors.length; k++)
        {
          if (visited[neighbors[k].id]) { continue; }

          visited[neighbors[k].id] = neighbors[k];
          visitedByRange[i + 1].push(neighbors[k]);
          frontier.push(neighbors[k]);
          this.indexedDistanceToStar[neighbors[k].id] = i;
        }
      }
    }
    const allVisited: Star[] = [];

    for (const id in visited)
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
  public getNearestStarForQualifier(qualifier: (star: Star) => boolean): Star
  {
    if (qualifier(this)) { return this; }


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
        if (visited[neighbor.id]) { continue; }

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
  public getDistanceToStar(target: Star): number
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
        for (const id in a.cost)
        {
          this.indexedDistanceToStar[id] = a.cost[id];
        }
      }
    }

    return this.indexedDistanceToStar[target.id];
  }
  public getVisionRange(): number
  {
    const baseRange = activeModuleData.ruleSet.vision.baseStarVisionRange;
    const buildingsEffect = this.buildings.getEffects().vision;

    return applyFlatAndMultiplierAdjustments(baseRange, buildingsEffect);
  }
  public getVision(): Star[]
  {
    return this.getLinkedInRange(this.getVisionRange()).all;
  }
  public getDetectionRange(): number
  {
    const baseRange = activeModuleData.ruleSet.vision.baseStarDetectionRange;
    const buildingsEffect = this.buildings.getEffects().detection;

    return applyFlatAndMultiplierAdjustments(baseRange, buildingsEffect);
  }
  public getDetection(): Star[]
  {
    return this.getLinkedInRange(this.getDetectionRange()).all;
  }
  public getHealingFactor(player: Player): number
  {
    let factor = 0;

    if (player === this.owner)
    {
      factor += 0.15;
    }

    return factor;
  }
  public getPresentPlayersByVisibility()
  {
    const byVisibilityAndId:
    {
      visible:
      {
        [playerId: number]: Player;
      };
      stealthy:
      {
        [playerId: number]: Player;
      };
      all:
      {
        [playerId: number]: Player;
      };
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

    for (const playerId in this.fleets)
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
  private generateSeedString(): string
  {
    return `${Math.round(this.x)}${Math.round(this.y)}${new Date().getTime()}`;
  }
  public buildManufactory(): void
  {
    this.manufactory = new Manufactory(this);
  }
  public serialize(): StarSaveData
  {
    const data: StarSaveData =
    {
      id: this.id,
      x: this.basisX,
      y: this.basisY,

      baseIncome: this.baseIncome,

      name: this.name,
      ownerId: this.owner ? this.owner.id : null,

      linksToIds: this.linksTo.map(star => star.id),
      linksFromIds: this.linksFrom.map(star => star.id),

      seed: this.seed,

      buildings: this.buildings.serialize(),
      territoryBuildings: this.territoryBuildings.serialize(),

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
  public getTerritoryBuildings(): TerritoryBuilding[]
  {
    // TODO 2018.06.06 |
    return this.territoryBuildings.buildings;

    // return this.buildings.filter(building =>
    // {
    //   return building.template.category === "defence";
    // }).sort((a, b) =>
    // {
    //   // TODO 2018.05.30 | more explicit way of checking this
    //   // headquarters
    //   if (a.template.maxPerType === 1)
    //   {
    //     return -1;
    //   }
    //   else if (b.template.maxPerType === 1)
    //   {
    //     return 1;
    //   }

    //   if (a.upgradeLevel !== b.upgradeLevel)
    //   {
    //     return b.upgradeLevel - a.upgradeLevel;
    //   }

    //   return a.id - b.id;
    // });
  }
  private getBuildingsForPlayer(player: Player): Building[]
  {
    return this.buildings.filter(building => building.controller === player);
  }
  public getBuildableBuildings(): BuildingTemplate[]
  {
    // doesn't check ownership. don't think we want to
    const buildingsByFamily = this.buildings.getBuildingsByFamily();

    return this.owner.getGloballyBuildableBuildings(this).filter(buildingTemplate =>
    {
      const family = buildingTemplate.family || buildingTemplate.type;

      const hasGlobalLimit = isFinite(buildingTemplate.maxBuiltGlobally);
      if (hasGlobalLimit)
      {
        const globalAmountBuilt = this.galaxyMap.globallyLimitedBuildingsByFamily[family] ?
          this.galaxyMap.globallyLimitedBuildingsByFamily[family].length :
          0;
        const isUnderGlobalLimit = globalAmountBuilt < buildingTemplate.maxBuiltGlobally;

        if (!isUnderGlobalLimit)
        {
          return false;
        }
      }

      const localAmountBuilt = buildingsByFamily[family] ? buildingsByFamily[family].length : 0;
      const isUnderLocalLimit = localAmountBuilt < buildingTemplate.maxBuiltAtLocation;

      return isUnderLocalLimit;
    });
  }
  // TODO 2018.07.30 | move to buildingcollection
  public getBuildingUpgrades(): {[buildingId: number]: BuildingUpgradeData[]}
  {
    const allUpgrades:
    {
      [buildingId: number]: BuildingUpgradeData[];
    } = {};

    const ownerBuildings = this.getBuildingsForPlayer(this.owner);

    for (let i = 0; i < ownerBuildings.length; i++)
    {
      const building = ownerBuildings[i];
      let upgrades = building.getPossibleUpgrades();

      upgrades = upgrades.filter(upgradeData =>
      {
        const parent = upgradeData.parentBuilding.template;
        const upgrade = upgradeData.template;
        if (parent.type === upgrade.type)
        {
          return true;
        }
        else
        {
          const isSameFamily = (upgrade.family && parent.family === upgrade.family);
          if (isSameFamily)
          {
            return true;
          }

          const maxAllowed = upgrade.maxBuiltAtLocation;
          const alreadyBuilt = this.buildings.filter(built =>
          {
            return built.template.family === upgrade.family;
          }).length;

          return alreadyBuilt < maxAllowed;
        }
      });

      if (upgrades.length > 0)
      {
        allUpgrades[building.id] = upgrades;
      }

    }

    return allUpgrades;
  }
}
