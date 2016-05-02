import FillerPoint from "../../../src/FillerPoint";
import Player from "../../../src/Player";
import Star from "../../../src/Star";
import Region from "../../../src/Region";
import TemplateIndexes from "../../../src/TemplateIndexes";
import
{
  randInt,
} from "../../../src/utility";

import MapGenFunction from "../../../src/templateinterfaces/MapGenFunction";
import ResourceTemplate from "../../../src/templateinterfaces/ResourceTemplate";
import UnitFamily from "../../../src/templateinterfaces/UnitFamily";

import MapGenResult from "../../../src/mapgencore/MapGenResult";
import
{
  makeVoronoi,
  relaxVoronoi,
  setVoronoiCells
} from "../../../src/mapgencore/voronoi";

import MapGenPoint from "../common/MapGenPoint";
import setupIndependents from "../common/setupIndependents";
import MapGenDataByStarID from "../common/MapGenDataByStarID";
import
{
  addDefenceBuildings,
  getStarConnectedness,
  distributeDistributablesPerSector,
  makeSectors,
  makePlayerForPirates,
  partiallySeverLinks,
  severLinksToNonAdjacentStars
} from "../common/mapGenUtils";

import SpiralGalaxyOptionValues from "./SpiralGalaxyOptionValues";
import generateSpiralPoints from "./generateSpiralPoints";

const spiralGalaxyGeneration: MapGenFunction = function(options: SpiralGalaxyOptionValues,
  players: Player[]): MapGenResult
{
  // generate points
  const points: MapGenPoint[] = generateSpiralPoints(options);

  // make and relax voronoi to adjust point locations
  const voronoiRegularity = options.basicOptions.starSizeRegularity / 100;
  const centerDensity = options.basicOptions.centerDensity / 100;
  const inverseCenterDensity = 1 - centerDensity;
  const getRelaxAmountFN = (point: MapGenPoint) =>
  {
    return (inverseCenterDensity + centerDensity * point.mapGenData.mapGenDistance) * voronoiRegularity;
  }
  
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
      const star = new Star(point.x, point.y);
      stars.push(star);
      starsWithMapGenPoints.push(
      {
        star: star,
        mapGenpoint: point
      });
    }
  });
  
  // set voronoi cells for stars (used for checking adjacency)
  const allPoints: (Star | FillerPoint)[] = [].concat(stars, fillerPoints);
  const diagram = makeVoronoi(allPoints, options.defaultOptions.width, options.defaultOptions.height);
  setVoronoiCells(diagram.cells);
  
  // create MapGenData index
  const mapGenDataByStarID: MapGenDataByStarID = {};
  starsWithMapGenPoints.forEach(starWithMapGenPoint =>
  {
    mapGenDataByStarID[starWithMapGenPoint.star.id] =
      starWithMapGenPoint.mapGenpoint.mapGenData;
  });
  
  // make regions (arm_n, center) etc
  const regions: Region[] = [];
  const regionsByID:
  {
    [regionID: string]: Region;
  } = {};
  
  starsWithMapGenPoints.forEach(starWithMapGenPoint =>
  {
    const tags = starWithMapGenPoint.mapGenpoint.mapGenData.tags;
    tags.forEach(tag =>
    {
      if (!regionsByID[tag])
      {
        regionsByID[tag] = new Region(tag);
        regions.push(regionsByID[tag]);
      }
      regionsByID[tag].addStar(starWithMapGenPoint.star);
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
    return region !== regionsByID["center"];
  });
  armRegions.forEach(region =>
  {
    region.severLinksToRegionsExcept([region, regionsByID["center"]]);
  });


  //   if all stars aren't connected to each other, start again
  const entireMapIsConnected = stars[0].getLinkedInRange(stars.length).all.length === stars.length;
  if (!entireMapIsConnected)
  {
    console.log("Regenerated map due to insufficient connections");
    return spiralGalaxyGeneration(options, players);
  }

  //   randomly sever links so links aren't as uniform
  partiallySeverLinks(stars, mapGenDataByStarID, 4, 2);
  
  // get star connectedness
  stars.forEach(star =>
  {
    mapGenDataByStarID[star.id].connectedness = getStarConnectedness(star, 3)
  });

  // make sectors
  const sectors = makeSectors(stars, mapGenDataByStarID, 3, 3);

  // make sector distribution flags
  const distributionFlagsBySectorID:
  {
    [sectorID: string]: string[];
  } = {};
  
  sectors.forEach(sector =>
  {
    const distributionFlagsByKeyWord =
    {
      arm: "common",
      center: "rare"
    }
    const foundDistributionFlags =
    {
      common: false,
      rare: false
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
      
      distributionFlagsBySectorID[sector.id] = distributionFlags;
    });
  });

  // set resources
  const resourcePlacerFN = function(sector: Region, resource: ResourceTemplate)
  {
    sector.stars[0].setResource(resource);
  }
  distributeDistributablesPerSector(
    sectors,
    distributionFlagsBySectorID,
    TemplateIndexes.distributablesByDistributionGroup.resources,
    resourcePlacerFN
  );

  // set local units
  const localUnitPlacerFN = function(sector: Region, unitFamily: UnitFamily)
  {
    for (let i = 0; i < sector.stars.length; i++)
    {
      const star = sector.stars[i];
      star.buildableUnitTypes = star.buildableUnitTypes.concat(unitFamily.associatedTemplates);
    }
  }
  distributeDistributablesPerSector(
    sectors,
    distributionFlagsBySectorID,
    TemplateIndexes.distributablesByDistributionGroup.unitFamilies,
    localUnitPlacerFN
  );

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
      startRegions.push(regionsByID["center"]);
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
        return mapGenDataByStarID[b.id].mapGenDistance - mapGenDataByStarID[a.id].mapGenDistance;
      });

      const star = starsByDistance[0];
      startPositions.push(star);
    }

    return startPositions
  })(startRegions);

  //   add star to player and construct initial buildings
  for (let i = 0; i < startPositions.length; i++)
  {
    const star = startPositions[i];
    const player = players[i];

    player.addStar(star);

    addDefenceBuildings(star, 2);
    star.buildManufactory();
  }

  // setup pirates
  const pirates = makePlayerForPirates();

  // add unowned locations to pirates
  sectors.forEach(sector =>
  {
    setupIndependents(
    {
      player: pirates,
      region: sector,
      intensity: 1,
      variance: 0,
      mapGenDataByStarID: mapGenDataByStarID
    });
  });

  // set stars base income
  stars.forEach(star =>
  {
    star.baseIncome = randInt(4, 6) * 10;
  });

  return new MapGenResult(
  {
    stars: stars,
    fillerPoints: fillerPoints,
    width: options.defaultOptions.width,
    height: options.defaultOptions.height,
    seed: "" + Math.random(), // TODO map gen
    independents: [pirates]
  });
}

export default spiralGalaxyGeneration;
