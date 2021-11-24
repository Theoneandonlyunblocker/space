import * as RNG from "rng-js";

import {FillerPoint} from "core/src/map/FillerPoint";
import {MapGenResult} from "core/src/map/MapGenResult";
import {Player} from "core/src/player/Player";
import {Region} from "core/src/map/Region";
import {Star} from "core/src/map/Star";
import {templateIndexes} from "core/src/app/TemplateIndexes";
import {activeModuleData} from "core/src/app/activeModuleData";
import
{
  randInt,
} from "core/src/generic/utility";

import {MapGenFunction} from "core/src/templateinterfaces/MapGenFunction";
import {RaceTemplate} from "core/src/templateinterfaces/RaceTemplate";
import {ResourceTemplate} from "core/src/templateinterfaces/ResourceTemplate";

import
{
  makeVoronoi,
  relaxVoronoi,
  setVoronoiCells,
} from "core/src/math/voronoi";

import * as Terrains from "modules/space/src/terrains/terrains";

import {MapGenDataByStarId} from "../common/MapGenDataByStarId";
import {MapGenPoint} from "../common/MapGenPoint";
import
{
  addTerritoryBuildings,
  distributeDistributablesPerSector,
  getStarConnectedness,
  makeSectors,
  partiallySeverLinks,
} from "../common/mapGenUtils";
import {setupIndependents} from "../common/setupIndependents";

import {SpiralGalaxyOptionValues} from "./SpiralGalaxyOptionValues";
import {centerRegionTag, generateSpiralPoints} from "./generateSpiralPoints";
import { moneyResource } from "modules/money/src/moneyResource";
import * as debug from "core/src/app/debug";


// TODO 2018.05.30 | needs to be broken into multiple functions bad
// @ts-ignore 2322
export const spiralGalaxyGeneration: MapGenFunction = (options: SpiralGalaxyOptionValues, players: Player[]) =>
{
  // seed
  const seed = "" + Math.random();
  const oldRandom = Math.random;
  Math.random = RNG.prototype.uniform.bind(new RNG(seed));

  // generate points
  const points: MapGenPoint[] = generateSpiralPoints(options);

  // make and relax voronoi to adjust point locations
  const diagramToRelax = makeVoronoi(
    points,
    options.defaultOptions.width,
    options.defaultOptions.height
  );

  applyVoronoiRelaxationToPoints(diagramToRelax,
  {
    areaRegularity: options.basicOptions.starSizeRegularity / 100,
    centerDensity: options.basicOptions.centerDensity / 100,
    iterations: 2,
  });

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
    star.getNeighbors().filter((point): point is Star =>
    {
      return isFinite((point as Star).id);
    }).forEach(neighbor =>
    {
      star.addLink(neighbor);
    });
  });

  // sever links
  //   sever links between arms
  const armRegions = regions.filter(region =>
  {
    return region !== regionsById[centerRegionTag];
  });
  armRegions.forEach(region =>
  {
    region.severLinksToRegionsExcept([region, regionsById[centerRegionTag]]);
  });


  //   if all stars aren't connected to each other, start again
  const entireMapIsConnected = stars[0].getAllLinkedStars().length === stars.length;
  if (!entireMapIsConnected)
  {
    debug.log("mapgen", "Regenerated map due to insufficient connections");

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
      for (const keyWord in distributionFlagsByKeyWord)
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
  // get start regions
  const getStartingRegions = () =>
  {
    const nonCenterRegions: Region[] = regions.filter(region =>
    {
      return region.id.indexOf(centerRegionTag) === -1;
    });

    const armCount = options.basicOptions.arms;
    const playersInArmsCount = Math.min(players.length, armCount);

    const playerArmStep = armCount / playersInArmsCount;

    const armStartingRegions: Region[] = [];
    for (let i = 0; i < playersInArmsCount; i++)
    {
      const regionNumber = Math.floor(i * playerArmStep);
      const regionToAdd = nonCenterRegions[regionNumber];

      armStartingRegions.push(regionToAdd);
    }

    const centerStartingRegions: Region[] = [];
    const leftOverPlayerCount = playersInArmsCount - armCount;
    for (let i = 0; i < leftOverPlayerCount; i++)
    {
      centerStartingRegions.push(regionsById[centerRegionTag]);
    }

    return [...armStartingRegions, ...centerStartingRegions];
  };
  const startRegions = getStartingRegions();

  // get start positions in start regions
  const startPositions = startRegions.map(startRegion =>
  {
    const starsByDistanceFromCenter = startRegion.stars.slice(0).sort((a, b) =>
    {
      return mapGenDataByStarId[b.id].distanceFromCenter - mapGenDataByStarId[a.id].distanceFromCenter;
    });

    const starFurthestAwayFromCenter = starsByDistanceFromCenter[0];

    return starFurthestAwayFromCenter;
  });

  // add star to player and construct initial buildings
  for (let i = 0; i < startPositions.length; i++)
  {
    const star = startPositions[i];
    const player = players[i];

    player.addStar(star);
    star.localRace = player.race;

    addTerritoryBuildings(star, 2);
    star.buildManufactory();
  }

  const starIsPlayerOwned = ((star: Star) =>
  {
    return star.owner && !star.owner.isIndependent;
  });

  stars.forEach(star =>
  {
    const nearestPlayerStar = star.getNearestStarForQualifier(starIsPlayerOwned);
    const distanceToPlayer = star.getDistanceToStar(nearestPlayerStar);
    mapGenDataByStarId[star.id].distanceFromPlayerOwnedLocation = distanceToPlayer;
  });

  // set races
  const racePlacerFN = (sector: Region, race: RaceTemplate) =>
  {
    const existingStarsWithRace = sector.stars.filter(star => Boolean(star.localRace));
    const existingRaceInSector = existingStarsWithRace.length > 0 ? existingStarsWithRace[0].localRace : null;

    sector.stars.forEach(star =>
    {
      star.localRace = existingRaceInSector || race;
    });
  };

  distributeDistributablesPerSector(
    sectors,
    distributionFlagsBySectorId,
    templateIndexes.distributablesByDistributionGroup.races,
    racePlacerFN,
  );

  // set resources
  const resourcePlacerFN = (sector: Region, resource: ResourceTemplate) =>
  {
    sector.stars[0].resource = resource;
  };
  distributeDistributablesPerSector(
    sectors,
    distributionFlagsBySectorId,
    templateIndexes.distributablesByDistributionGroup.resources,
    resourcePlacerFN,
  );

  // set terrains
  stars.forEach(star =>
  {
    if (star.resource)
    {
      star.terrain = Terrains.asteroidsTerrain;
    }
    else
    {
      star.terrain = Terrains.noneTerrain;
    }
  });

  // add unowned locations to independents
  const independents: Player[] = [];

  sectors.forEach(sector =>
  {
    const sectorRace = sector.stars[0].localRace;

    const sectorIndependents = sectorRace.generateIndependentPlayer(activeModuleData.templates.subEmblems);
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
    star.baseIncome =
    {
      [moneyResource.key]: randInt(4, 6) * 10,
    };
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

function applyVoronoiRelaxationToPoints(
  diagram: Voronoi.Result<MapGenPoint>,
  props:
  {
    areaRegularity: number;
    centerDensity: number;
    iterations: number;
  },
): void
{
  const inverseCenterDensity = 1 - props.centerDensity;
  const getRelaxAmountFN = (point: MapGenPoint) =>
  {
    return (inverseCenterDensity + props.centerDensity * point.mapGenData.distanceFromCenter) * props.areaRegularity;
  };

  for (let i = 0; i < props.iterations; i++)
  {
    relaxVoronoi(diagram, getRelaxAmountFN);
  }
}
