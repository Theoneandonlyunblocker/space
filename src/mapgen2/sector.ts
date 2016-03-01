/// <reference path="../templateinterfaces/iresourcetemplate.d.ts" />
/// <reference path="../star.ts" />

module Rance
{
  export module MapGen2
  {
    export class Sector
    {
      id: number;
      stars: Star[] = [];
      distributionFlags: string[];
      resourceType: Templates.IResourceTemplate;
      resourceLocation: Star;
      addedDistributables: Templates.IDistributable[] = [];

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
      addResource(resource: Templates.IResourceTemplate)
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

        for (var i = 0; i < this.stars.length; i++)
        {
          var frontier = this.stars[i].getLinkedInRange(1).all;
          for (var j = 0; j < frontier.length; j++)
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

        for (var i = 0; i < neighborStars.length; i++)
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
        for (var i = 0; i < this.stars.length; i++)
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
        for (var regionId in regionsByStars)
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

        for (var i = 0; i < this.stars.length; i++)
        {
          var ownStar = this.stars[i];
          var halfEdges = ownStar.voronoiCell.halfedges;
          for (var j = 0; j < halfEdges.length; j++)
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
      setupIndependents(player: Player, intensity: number = 1, variance: number = 0.33)
      {
        var independentStars = this.stars.filter(function(star: Star)
        {
          return !star.owner || star.owner.isIndependent;
        });

        var distanceFromPlayerOwnedLocationById:
        {
          [starId: number]: number;
        } = {};

        var starIsOwnedByPlayerQualifierFN = function(star: Star)
        {
          return star.owner && !star.owner.isIndependent;
        }

        var makeUnitFN = function(template: Templates.IUnitTemplate, player: Player,
          unitStatsModifier: number, unitHealthModifier: number)
        {
          var unit = new Unit(template);

          unit.setAttributes(unitStatsModifier);
          unit.setBaseHealth(unitHealthModifier);
          player.addUnit(unit);

          return unit;
        }

        var maxDistance: number = 0;

        for (var i = 0; i < independentStars.length; i++)
        {
          var star = independentStars[i];

          player.addStar(star);
          star.addBuilding(new Building(
          {
            template: app.moduleData.Templates.Buildings["starBase"],
            location: star
          }));

          var nearestPlayerStar = star.getNearestStarForQualifier(
            starIsOwnedByPlayerQualifierFN);
          var distance = star.getDistanceToStar(nearestPlayerStar);
          distanceFromPlayerOwnedLocationById[star.id] = distance;
          maxDistance = Math.max(maxDistance, distance);
        }

        var starsAtMaxDistance = independentStars.filter(function(star: Star)
        {
          return distanceFromPlayerOwnedLocationById[star.id] === maxDistance;
        });

        var commanderStar = starsAtMaxDistance.sort(function(a: Star, b: Star)
        {
          return b.mapGenData.connectedness - a.mapGenData.connectedness;
        })[0];

        var minShips = 2;
        var maxShips = 5;

        var globalBuildableUnitTypes = player.getGloballyBuildableUnits();

        for (var i = 0; i < independentStars.length; i++)
        {
          var star = independentStars[i];
          var distance = distanceFromPlayerOwnedLocationById[star.id];
          var inverseMapGenDistance = 1 - star.mapGenData.distance;

          var localBuildableUnitTypes: Templates.IUnitTemplate[] = [];
          for (var j = 0; j < star.buildableUnitTypes.length; j++)
          {
            var template = star.buildableUnitTypes[j];
            if (!template.technologyRequirements ||
              star.owner.meetsTechnologyRequirements(template.technologyRequirements))
            {
              localBuildableUnitTypes.push(template);
            }
          }

          // TODO map gen | kinda weird
          var shipAmount = minShips;
          for (var j = minShips; j < distance; j++)
          {
            shipAmount += (1 - variance + Math.random() * distance * variance) * intensity;

            if (shipAmount >= maxShips)
            {
              shipAmount = maxShips;
              break;
            }
          }

          var elitesAmount = Math.floor(shipAmount / 2);

          var templateCandidates = localBuildableUnitTypes.concat(globalBuildableUnitTypes);
          var units: Unit[] = [];
          if (star === commanderStar)
          {
            var template: Templates.IUnitTemplate = getRandomArrayItem(localBuildableUnitTypes);
            var commander = makeUnitFN(template, player, 1.4, 1.4 + inverseMapGenDistance);
            commander.name = "Pirate commander";
            units.push(commander);
          }
          for (var j = 0; j < shipAmount; j++)
          {
            var isElite = j < elitesAmount;
            var unitHealthModifier = (isElite ? 1.2 : 1) + inverseMapGenDistance;
            var unitStatsModifier = (isElite ? 1.2 : 1);
            var template: Templates.IUnitTemplate = getRandomArrayItem(templateCandidates);

            var unit = makeUnitFN(template, player, unitStatsModifier, unitHealthModifier);
            unit.name = (isElite ? "Pirate elite" : "Pirate");
            units.push(unit);
          }
          
          var fleet = new Fleet(player, units, star, undefined, false);
          fleet.name = "Pirates";
        }
      }
    }
  }
}
