import Star from "../../../src/Star";
import Player from "../../../src/Player";
import Unit from "../../../src/Unit";
import Building from "../../../src/Building";
import Fleet from "../../../src/Fleet";
import
{
  getRandomArrayItem
} from "../../../src/utility";

import ResourceTemplate from "../../../src/templateinterfaces/ResourceTemplate";
import Distributable from "../../../src/templateinterfaces/Distributable";
import UnitTemplate from "../../../src/templateinterfaces/UnitTemplate";

import Region from "./Region";

import
{
  starBase
} from "../../defaultbuildings/templates/Templates";

export default class Sector
{
  id: number;
  stars: Star[] = [];
  distributionFlags: string[];
  resourceType: ResourceTemplate;
  resourceLocation: Star;
  addedDistributables: Distributable[] = [];

  constructor(id: number)
  {
    this.id = id
  }
  addStar(star: Star)
  {
    if (star.mapGenData.sector)
    {
      throw new Error("Star already part of a sector");
    }

    this.stars.push(star);
    star.mapGenData.sector = this;
  }
  addResource(resource: ResourceTemplate)
  {
    var star = this.stars[0];

    this.resourceType = resource;
    this.resourceLocation = star;
    star.setResource(resource);
  }

  getNeighboringStars()
  {
    var neighbors: Star[] = [];
    var alreadyAdded:
    {
      [starId: number]: boolean;
    } = {};

    for (let i = 0; i < this.stars.length; i++)
    {
      var frontier = this.stars[i].getLinkedInRange(1).all;
      for (let j = 0; j < frontier.length; j++)
      {
        if (frontier[j].mapGenData.sector !== this && !alreadyAdded[frontier[j].id])
        {
          neighbors.push(frontier[j]);
          alreadyAdded[frontier[j].id] = true;
        }
      }
    }

    return neighbors;
  }

  getNeighboringSectors()
  {
    var sectors: Sector[] = [];
    var alreadyAdded:
    {
      [sectorId: number]: boolean;
    } = {};

    var neighborStars = this.getNeighboringStars();

    for (let i = 0; i < neighborStars.length; i++)
    {
      var sector = neighborStars[i].mapGenData.sector;
      if (!alreadyAdded[sector.id])
      {
        alreadyAdded[sector.id] = true;
        sectors.push(sector);
      }
    }

    return sectors;
  }

  getMajorityRegions()
  {
    var regionsByStars:
    {
      [regionId: string]:
      {
        count: number;
        region: Region;
      };
    } = {};

    var biggestRegionStarCount = 0;
    for (let i = 0; i < this.stars.length; i++)
    {
      var star = this.stars[i];
      var region = star.mapGenData.region;

      if (!regionsByStars[region.id])
      {
        regionsByStars[region.id] =
        {
          count: 0,
          region: region
        }
      }

      regionsByStars[region.id].count++;

      if (regionsByStars[region.id].count > biggestRegionStarCount)
      {
        biggestRegionStarCount = regionsByStars[region.id].count;
      }
    }

    var majorityRegions: Region[] = [];
    for (let regionId in regionsByStars)
    {
      if (regionsByStars[regionId].count >= biggestRegionStarCount)
      {
        majorityRegions.push(regionsByStars[regionId].region);
      }
    }

    return majorityRegions;
  }
  getPerimeterLengthWithStar(star: Star): number
  {
    var perimeterLength: number = 0;

    for (let i = 0; i < this.stars.length; i++)
    {
      var ownStar = this.stars[i];
      var halfEdges = ownStar.voronoiCell.halfedges;
      for (let j = 0; j < halfEdges.length; j++)
      {
        var edge = halfEdges[j].edge;
        if (edge.lSite === star || edge.rSite === star)
        {
          var edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);
          perimeterLength += edgeLength;
        }
      }
    }

    return perimeterLength;
  }
  private getDistanceToNearestPlayerOwnerLocationByStarID(): {[starID: number]: number}
  {
    const distanceByStarID:
    {
      [starID: number]: number;
    } = {};
    
    this.stars.forEach(star =>
    {
      const nearestPlayerStar = star.getNearestStarForQualifier(star =>
      {
        return star.owner && !star.owner.isIndependent;
      });
      
      const distanceToNearestPlayerStar = star.getDistanceToStar(nearestPlayerStar);
      
      distanceByStarID[star.id] = distanceToNearestPlayerStar;
    });
    
    return distanceByStarID;
  }
  private getCommanderStar(distanceFromPlayerOwnedLocationById: {[starID: number]: number}): Star
  {
    const independentStars = this.stars.filter(star =>
    {
      return !star.owner || star.owner.isIndependent;
    });
    
    let maxDistance = 0;
    const starsByDistance:
    {
      [distance: number]: Star[];
    } = {};
    independentStars.forEach(star =>
    {
      const distance = distanceFromPlayerOwnedLocationById[star.id];
      maxDistance = Math.max(distance, maxDistance);
      
      if (!starsByDistance[distance])
      {
        starsByDistance[distance] = [];
      }
      starsByDistance[distance].push(star);
    });
    
    const starsAtMaxDistance = starsByDistance[maxDistance];
    
    return starsAtMaxDistance.sort((a, b) =>
    {
      const connectednessSort = b.mapGenData.connectedness - a.mapGenData.connectedness;
      if (connectednessSort)
      {
        return connectednessSort;
      }
      else
      {
        return b.mapGenData.distance - a.mapGenData.distance;
      }
    })[0];
  }
  public setupIndependents(player: Player, intensity: number = 1, variance: number = 0.33)
  {
    var independentStars = this.stars.filter(function(star: Star)
    {
      return !star.owner || star.owner.isIndependent;
    });

    const distanceFromPlayerOwnedLocationById = this.getDistanceToNearestPlayerOwnerLocationByStarID();
    const commanderStar = this.getCommanderStar(distanceFromPlayerOwnedLocationById);

    independentStars.forEach(star =>
    {
      player.addStar(star);
      star.addBuilding(new Building(
      {
        template: starBase,
        location: star
      }));
    });
    
    const makeUnitFN = function(template: UnitTemplate, player: Player,
      unitStatsModifier: number, unitHealthModifier: number)
    {
      const unit = new Unit(template);

      unit.setAttributes(unitStatsModifier);
      unit.setBaseHealth(unitHealthModifier);
      player.addUnit(unit);

      return unit;
    }


    const minUnits = 2;
    const maxUnits = 5;

    const globalBuildableUnitTypes = player.getGloballyBuildableUnits();
    
    independentStars.forEach(star =>
    {
      const distance = distanceFromPlayerOwnedLocationById[star.id];
      const inverseMapGenDistance = 1 - star.mapGenData.distance;
      const localBuildableUnitTypes = star.buildableUnitTypes.filter(unitTemplate =>
      {
        return (!unitTemplate.technologyRequirements ||
          star.owner.meetsTechnologyRequirements(unitTemplate.technologyRequirements));
      });
      
      
      // TODO map gen | kinda weird
      var unitsToAddCount = minUnits;
      for (let j = minUnits; j < distance; j++)
      {
        unitsToAddCount += (1 - variance + Math.random() * distance * variance) * intensity;

        if (unitsToAddCount >= maxUnits)
        {
          unitsToAddCount = maxUnits;
          break;
        }
      }

      var elitesAmount = Math.floor(unitsToAddCount / 2);

      var templateCandidates = localBuildableUnitTypes.concat(globalBuildableUnitTypes);
      var units: Unit[] = [];
      if (star === commanderStar)
      {
        var template: UnitTemplate = getRandomArrayItem(localBuildableUnitTypes);
        var commander = makeUnitFN(template, player, 1.4, 1.4 + inverseMapGenDistance);
        commander.name = "Pirate commander";
        units.push(commander);
      }
      for (let j = 0; j < unitsToAddCount; j++)
      {
        var isElite = j < elitesAmount;
        var unitHealthModifier = (isElite ? 1.2 : 1) + inverseMapGenDistance;
        var unitStatsModifier = (isElite ? 1.2 : 1);
        var template: UnitTemplate = getRandomArrayItem(templateCandidates);

        const unit = new Unit(template);
        unit.name = (isElite ? "Pirate elite" : "Pirate");
        
        unit.setAttributes(unitStatsModifier);
        unit.setBaseHealth(unitHealthModifier);
        player.addUnit(unit);
        units.push(unit);
      }
      
      var fleet = new Fleet(player, units, star, undefined, false);
      fleet.name = "Pirates";
    });
  }
}
