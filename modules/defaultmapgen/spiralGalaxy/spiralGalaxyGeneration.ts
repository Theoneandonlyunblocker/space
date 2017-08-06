/// <reference path="../../../lib/rng.d.ts" />

import {activeModuleData} from "../../../src/activeModuleData";
import FillerPoint from "../../../src/FillerPoint";
import MapGenResult from "../../../src/MapGenResult";
import Player from "../../../src/Player";
import Region from "../../../src/Region";
import Star from "../../../src/Star";
import TemplateIndexes from "../../../src/TemplateIndexes";
import
{
  randInt,
} from "../../../src/utility";

import MapGenFunction from "../../../src/templateinterfaces/MapGenFunction";
import {RaceTemplate} from "../../../src/templateinterfaces/RaceTemplate";
import ResourceTemplate from "../../../src/templateinterfaces/ResourceTemplate";

import
{
  makeVoronoi,
  relaxVoronoi,
  setVoronoiCells,
} from "../../../src/voronoi";

import MapGenDataByStarId from "../common/MapGenDataByStarId";
import MapGenPoint from "../common/MapGenPoint";
import
{
  addDefenceBuildings,
  distributeDistributablesPerSector,
  getStarConnectedness,
  makeSectors,
  partiallySeverLinks,
} from "../common/mapGenUtils";
import setupIndependents from "../common/setupIndependents";

import SpiralGalaxyOptionValues from "./SpiralGalaxyOptionValues";
import generateSpiralPoints from "./generateSpiralPoints";

const spiralGalaxyGeneration: MapGenFunction = function(options: SpiralGalaxyOptionValues,
  players: Player[]): MapGenResult
{
  // seed
  const seed = "" + Math.random();
  const oldRandom = Math.random;
  Math.random = RNG.prototype.uniform.bind(new RNG(seed));

  // generate points
  const points: MapGenPoint[] = generateSpiralPoints(options);

  // make and relax voronoi to adjust point locations
  const voronoiRegularity = options.basicOptions.starSizeRegularity / 100;
  const centerDensity = options.basicOptions.centerDensity / 100;
  const inverseCenterDensity = 1 - centerDensity;
  const getRelaxAmountFN = (point: MapGenPoint) =>
  {
    return (inverseCenterDensity + centerDensity * point.mapGenData.mapGenDistance) * voronoiRegularity;
  };

  for (let i = 0; i < 2; i++)
  {
    const diagram = makeVoronoi(points, options.defaultOptions.width,
      options.defaultOptions.height);

    relaxVoronoi(diagram, getRelaxAmountFN);
  }

  // convert to stars and filler points
  const starsWithMapGenPoints:
  {
    star: Star;
    mapGenpoint: MapGenPoint;
  }[] = [];

  const stars: Star[] = [];
  const fillerPoints: FillerPoint[] = [];

  points.forEach(point =>
  {
    if (point.mapGenData.isFiller)
    {
      const fillerPoint = new FillerPoint(point.x, point.y);
      fillerPoints.push(fillerPoint);
    }
    else
    {
      const star = new Star(
      {
        x: point.x,
        y: point.y,
      });
      stars.push(star);
      starsWithMapGenPoints.push(
      {
        star: star,
        mapGenpoint: point,
      });
    }
  });

  // set voronoi cells for stars (used for checking adjacency)
  const allPoints: (Star | FillerPoint)[] = [...stars, ...fillerPoints];
  const diagram = makeVoronoi(allPoints, options.defaultOptions.width, options.defaultOptions.height);
  setVoronoiCells(diagram.cells);

  // create MapGenData index
  const mapGenDataByStarId: MapGenDataByStarId = {};
  starsWithMapGenPoints.forEach(starWithMapGenPoint =>
  {
    mapGenDataByStarId[starWithMapGenPoint.star.id] =
      starWithMapGenPoint.mapGenpoint.mapGenData;
  });

  // make regions (arm_n, center) etc
  const regions: Region[] = [];
  const regionsById:
  {
    [regionId: string]: Region;
  } = {};

  starsWithMapGenPoints.forEach(starWithMapGenPoint =>
  {
    const tags = starWithMapGenPoint.mapGenpoint.mapGenData.tags;
    tags.forEach(tag =>
    {
      if (!regionsById[tag])
      {
        regionsById[tag] = new Region(tag);
        regions.push(regionsById[tag]);
      }
      regionsById[tag].addStar(starWithMapGenPoint.star);
    });
  });

  // link all adjacent stars
  stars.forEach(star =>
  {
    star.getNeighbors().filter(neighbor =>
    {
      const castedPoint = <Star> neighbor;
      const isFiller = !isFinite(castedPoint.id);
      return !isFiller;
    }).forEach((neighbor: Star) =>
    {
      star.addLink(neighbor);
    });
  });

  // sever links
  //   sever links between arms
  const armRegions = regions.filter(region =>
  {
    return region !== regionsById["center"];
  });
  armRegions.forEach(region =>
  {
    region.severLinksToRegionsExcept([region, regionsById["center"]]);
  });


  //   if all stars aren't connected to each other, start again
  const entireMapIsConnected = stars[0].getAllLinkedStars().length === stars.length;
  if (!entireMapIsConnected)
  {
    console.log("Regenerated map due to insufficient connections");
    return spiralGalaxyGeneration(options, players);
  }

  //   randomly sever links so links aren't as uniform
  partiallySeverLinks(stars, mapGenDataByStarId, 4, 2);

  // get star connectedness
  stars.forEach(star =>
  {
    mapGenDataByStarId[star.id].connectedness = getStarConnectedness(star, 3);
  });

  // make sectors
  const sectors = makeSectors(stars, mapGenDataByStarId, 3, 3);

  // make sector distribution flags
  const distributionFlagsBySectorId:
  {
    [sectorId: string]: string[];
  } = {};

  sectors.forEach(sector =>
  {
    const distributionFlagsByKeyWord =
    {
      arm: "common",
      center: "rare",
    };
    const foundDistributionFlags =
    {
      common: false,
      rare: false,
    };
    const distributionFlags: string[] = [];

    const majorityRegions = sector.getMajorityRegions(regions);
    majorityRegions.forEach(region =>
    {
      for (let keyWord in distributionFlagsByKeyWord)
      {
        if (region.id.indexOf(keyWord) !== -1)
        {
          const distributionFlag = distributionFlagsByKeyWord[keyWord];
          if (!foundDistributionFlags[distributionFlag])
          {
            foundDistributionFlags[distributionFlag] = true;
            distributionFlags.push(distributionFlag);
          }
        }
      }

      distributionFlagsBySectorId[sector.id] = distributionFlags;
    });
  });

    // set players
  //   get start regions
  const startRegions: Region[] = (function setStartingRegions()
  {
    const availableStartRegions: Region[] = regions.filter(region =>
    {
      return region.id.indexOf("center") === -1;
    });

    const armCount = options.basicOptions.arms;
    const playersInArmsCount = Math.min(players.length, armCount);

    const playerArmStep = armCount / playersInArmsCount;

    const startRegions: Region[] = [];

    for (let i = 0; i < playersInArmsCount; i++)
    {
      const regionNumber = Math.floor(i * playerArmStep);
      const regionToAdd = availableStartRegions[regionNumber];

      startRegions.push(regionToAdd);
    }

    const leftOverPlayerCount = playersInArmsCount - armCount;
    for (let i = 0; i < leftOverPlayerCount; i++)
    {
      startRegions.push(regionsById["center"]);
    }

    return startRegions;
  })();

  //   get start positions in start regions
  const startPositions: Star[] = (function getStartPoints(regions: Region[])
  {
    const startPositions: Star[] = [];

    for (let i = 0; i < regions.length; i++)
    {
      const region = regions[i];

      const starsByDistance = region.stars.slice(0).sort(function(a: Star, b: Star)
      {
        return mapGenDataByStarId[b.id].mapGenDistance - mapGenDataByStarId[a.id].mapGenDistance;
      });

      const star = starsByDistance[0];
      startPositions.push(star);
    }

    return startPositions;
  })(startRegions);

  //   add star to player and construct initial buildings
  for (let i = 0; i < startPositions.length; i++)
  {
    const star = startPositions[i];
    const player = players[i];

    player.addStar(star);
    star.race = player.race;

    addDefenceBuildings(star, 2);
    star.buildManufactory();
  }

  // set star distance from player
  (function setDistanceFromPlayer()
  {
    const isPlayerOwnedFN = ((star: Star) =>
    {
      return star.owner && !star.owner.isIndependent;
    });

    stars.forEach(star =>
    {
      const nearestPlayerStar = star.getNearestStarForQualifier(isPlayerOwnedFN);
      const distanceToPlayer = star.getDistanceToStar(nearestPlayerStar);
      mapGenDataByStarId[star.id].distanceFromPlayerOwnedLocation = distanceToPlayer;
    });
  })();

  // set races
  const racePlacerFN = function(sector: Region, race: RaceTemplate)
  {
    const existingStarsWithRace = sector.stars.filter(star => Boolean(star.race));
    const existingRaceInSector = existingStarsWithRace.length > 0 ? existingStarsWithRace[0].race : null;

    sector.stars.forEach(star =>
    {
      star.race = existingRaceInSector || race;
    });
  };

  distributeDistributablesPerSector(
    sectors,
    distributionFlagsBySectorId,
    TemplateIndexes.distributablesByDistributionGroup.races,
    racePlacerFN,
  );

  // set resources
  const resourcePlacerFN = function(sector: Region, resource: ResourceTemplate)
  {
    sector.stars[0].setResource(resource);
  };
  distributeDistributablesPerSector(
    sectors,
    distributionFlagsBySectorId,
    TemplateIndexes.distributablesByDistributionGroup.resources,
    resourcePlacerFN,
  );

  // add unowned locations to independents
  const independents: Player[] = [];

  sectors.forEach(sector =>
  {
    const sectorRace = sector.stars[0].race;

    const sectorIndependents = sectorRace.generateIndependentPlayer(activeModuleData.Templates.SubEmblems);
    independents.push(sectorIndependents);

    setupIndependents(
    {
      player: sectorIndependents,
      region: sector,
      intensity: 1,
      variance: 0,
      mapGenDataByStarId: mapGenDataByStarId,
    });
  });

  // set stars base income
  stars.forEach(star =>
  {
    star.baseIncome = randInt(4, 6) * 10;
  });

  // restore Math.random
  Math.random = oldRandom;

  return new MapGenResult(
  {
    stars: stars,
    fillerPoints: fillerPoints,
    width: options.defaultOptions.width,
    height: options.defaultOptions.height,
    seed: seed,
    independents: independents,
  });
};

export default spiralGalaxyGeneration;
