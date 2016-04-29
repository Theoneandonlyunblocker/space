import
{
  sectorCommand,
  starBase
} from "../../defaultbuildings/templates/Templates";
import
{
  Flag_of_Edward_England
} from "../../defaultemblems/SubEmblemTemplates";

import Sector from "./Sector";
import triangulate from "./triangulate";

import Star from "../../../src/Star";
import Building from "../../../src/Building";
import Player from "../../../src/Player";
import Color from "../../../src/Color";
import Emblem from "../../../src/Emblem";
import Flag from "../../../src/Flag";
import TemplateIndexes from "../../../src/TemplateIndexes";
import
{
  aStar
} from "../../../src/pathfinding";
import
{
  getRelativeWeightsFromObject,
  getRandomKeyWithWeights
} from "../../../src/utility";


import Distributable from "../../../src/templateinterfaces/Distributable";

export function linkAllStars(stars: Star[])
{
  if (stars.length < 3)
  {
    if (stars.length === 2)
    {
      stars[0].addLink(stars[1]);
    }

    return;
  }

  var triangles = triangulate(stars);

  for (let i = 0; i < triangles.length; i++)
  {
    var edges = <Star[][]> triangles[i].getEdges();
    for (let j = 0; j < edges.length; j++)
    {
      edges[j][0].addLink(edges[j][1]);
    }
  }
}
export function partiallyCutLinks(stars: Star[], minConnections: number, maxCutsPerRegion: number)
{
  for (let i = 0; i < stars.length; i++)
  {
    var star = stars[i];
    var regionsAlreadyCut:
    {
      [regionId: number]: number;
    } = {};

    var neighbors = star.getAllLinks();

    if (neighbors.length <= minConnections) continue;

    for (let j = neighbors.length - 1; j >= 0; j--)
    {
      var neighbor = neighbors[j];

      if (regionsAlreadyCut[neighbor.mapGenData.region.id] >= maxCutsPerRegion)
      {
        continue;
      }

      var neighborLinks = neighbor.getAllLinks();

      if (neighbors.length <= minConnections || neighborLinks.length <= minConnections) continue;

      var totalLinks = neighbors.length + neighborLinks.length;

      var cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnections) * (1 - star.mapGenData.distance);
      var minMultipleCutThreshhold = 0.15;
      if (cutThreshhold > 0)
      {
        if (Math.random() < cutThreshhold)
        {
          star.removeLink(neighbor);
          neighbors.pop();

          if (!regionsAlreadyCut[neighbor.mapGenData.region.id])
          {
            regionsAlreadyCut[neighbor.mapGenData.region.id] = 0;
          }
          regionsAlreadyCut[neighbor.mapGenData.region.id]++;

          var path = aStar(star, neighbor);

          if (!path) // left star inaccesible
          {
            star.addLink(neighbor);
            regionsAlreadyCut[neighbor.mapGenData.region.id]--;
            neighbors.push(neighbor);
          }
        }

        cutThreshhold -= minMultipleCutThreshhold;
      }
    }
  }
}
export function calculateConnectedness(stars: Star[], maxRange: number)
{
  for (let i = 0; i < stars.length; i++)
  {
    var connectedness: number = 0;
    var linkedByRange = stars[i].getLinkedInRange(maxRange).byRange;
    for (let rangeString in linkedByRange)
    {
      var range = parseInt(rangeString);
      connectedness += linkedByRange[rangeString].length / range;
    }
    stars[i].mapGenData.connectedness = connectedness;
  }
}
export function makeSectors(stars: Star[], minSize: number, maxSize: number)
{
  /*
  while average size sectors left to assign && unassigned stars left
    pick random unassigned star
    if star cannot form island bigger than minsize
      put from unassigned into leftovers & continue
    else
      add random neighbors into sector until minsize is met

  while leftovers
    pick random leftover
    if leftover has no assigned neighbor pick, continue

    leftover gets assigned to smallest neighboring sector
    if sizes equal, assign to sector with least neighboring leftovers

  for each sector larger than maxSize
    assign extra stars to smaller neighboring sectors
   */
  var totalStars = stars.length;
  var unassignedStars: Star[] = stars.slice(0);
  var leftoverStars: Star[] = [];
  
  var averageSize = (minSize + maxSize) / 2;
  var averageSectorsAmount = Math.round(totalStars / averageSize);

  var sectorsById:
  {
    [sectorId: number]: Sector;
  } = {};
  var sectorIdGen = 0;

  var sectorsOverMaxSize: Sector[] = [];

  var sameSectorFN = function(a: Star, b: Star)
  {
    return a.mapGenData.sector === b.mapGenData.sector;
  };

  calculateConnectedness(stars, minSize);
  unassignedStars.sort(function(a: Star, b: Star)
  {
    return b.mapGenData.connectedness - a.mapGenData.connectedness;
  });

  while (averageSectorsAmount > 0 && unassignedStars.length > 0)
  {
    var seedStar = unassignedStars.pop();
    var canFormMinSizeSector = seedStar.getIslandForQualifier(sameSectorFN, minSize).length >= minSize;

    if (canFormMinSizeSector)
    {
      var sector = new Sector(sectorIdGen++);
      sectorsById[sector.id] = sector;

      var discoveryStarIndex = 0;
      sector.addStar(seedStar);

      while (sector.stars.length < minSize)
      {
        var discoveryStar = sector.stars[discoveryStarIndex];

        var frontier = discoveryStar.getLinkedInRange(1).all;
        frontier = frontier.filter(function(star: Star)
        {
          return !star.mapGenData.sector;
        });

        while (sector.stars.length < minSize && frontier.length > 0)
        {
          var frontierSortScores:
          {
            [starId: number]: number
          } = {};

          for (let i = 0; i < frontier.length; i++)
          {
            var perimeter = sector.getPerimeterLengthWithStar(frontier[i]) / 15;
            var sortScore = frontier[i].mapGenData.connectedness - perimeter;

            frontierSortScores[frontier[i].id] = sortScore;
          }

          frontier.sort(function(a: Star, b: Star)
          {
            return frontierSortScores[b.id] - frontierSortScores[a.id];
          });

          var toAdd = frontier.pop();
          unassignedStars.splice(unassignedStars.indexOf(toAdd), 1);

          sector.addStar(toAdd);
        }

        discoveryStarIndex++;
      }
    }
    else
    {
      leftoverStars.push(seedStar);
    }
  }

  while (leftoverStars.length > 0)
  {
    var star = leftoverStars.pop();

    var neighbors: Star[] = star.getLinkedInRange(1).all;
    var alreadyAddedNeighborSectors:
    {
      [sectorId: number]: boolean;
    } = {};
    var candidateSectors: Sector[] = [];

    for (let j = 0; j < neighbors.length; j++)
    {
      if (!neighbors[j].mapGenData.sector) continue;
      else
      {
        if (!alreadyAddedNeighborSectors[neighbors[j].mapGenData.sector.id])
        {
          alreadyAddedNeighborSectors[neighbors[j].mapGenData.sector.id] = true;
          candidateSectors.push(neighbors[j].mapGenData.sector);
        }
      }
    }

    // all neighboring stars don't have sectors
    // put star at back of queue and try again later
    if (candidateSectors.length < 1)
    {
      leftoverStars.unshift(star);
      continue;
    }

    var unclaimedNeighborsPerSector:
    {
      [sectorId: number]: number;
    } = {};

    for (let j = 0; j < candidateSectors.length; j++)
    {
      var sectorNeighbors = candidateSectors[j].getNeighboringStars();
      var unclaimed = 0;
      for (let k = 0; k < sectorNeighbors.length; k++)
      {
        if (!sectorNeighbors[k].mapGenData.sector)
        {
          unclaimed++;
        }
      }

      unclaimedNeighborsPerSector[candidateSectors[j].id] = unclaimed;
    }

    candidateSectors.sort(function(a: Sector, b: Sector)
    {
      var sizeSort = a.stars.length - b.stars.length;
      if (sizeSort) return sizeSort;

      var unclaimedSort = unclaimedNeighborsPerSector[b.id] -
        unclaimedNeighborsPerSector[a.id];
      if (sizeSort) return unclaimedSort;

      var perimeterSort = b.getPerimeterLengthWithStar(star) - a.getPerimeterLengthWithStar(star);
      if (perimeterSort) return perimeterSort;
    });

    candidateSectors[0].addStar(star);
  }

  return sectorsById;
}
export function setSectorDistributionFlags(sectors: Sector[])
{
  for (let i = 0; i < sectors.length; i++)
  {
    var sector = sectors[i];
    sector.distributionFlags = [];
    var majorityRegions = sector.getMajorityRegions();
    for (let j = 0; j < majorityRegions.length; j++)
    {
      if (majorityRegions[j].id.indexOf("center") !== -1)
      {
        sector.distributionFlags.push("rare");
      }
      else
      {
        sector.distributionFlags.push("common");
      }
    }
  }
}
export function distributeDistributablesPerSector(sectors: Sector[],
  distributableType: string,
  allDistributables: any,
  placerFunction: (sector: Sector, distributable: Distributable) => void)
{
  if (!sectors[0].distributionFlags)
  {
    setSectorDistributionFlags(sectors);
  }

  var probabilityWeights:
  {
    [distributableName: string]: number;
  } = {};
  for (let name in allDistributables)
  {
    probabilityWeights[name] = allDistributables[name].rarity;
  }

  for (let i = 0; i < sectors.length; i++)
  {
    var sector = sectors[i];
    var alreadyAddedByWeight = getRelativeWeightsFromObject(probabilityWeights);
    var candidates: Distributable[] = [];

    for (let j = 0; j < sector.distributionFlags.length; j++)
    {
      var flag = sector.distributionFlags[j];
      var distributablesForFlag = TemplateIndexes.distributablesByDistributionGroup[flag][distributableType];
      candidates = candidates.concat(distributablesForFlag);
    }

    if (candidates.length === 0) continue;

    var neighborSectors = sector.getNeighboringSectors();
    var candidatesNotInNeighboringSectors = candidates.filter(function(candidate: Distributable)
    {
      for (let k = 0; k < neighborSectors.length; k++)
      {
        if (neighborSectors[k].addedDistributables.indexOf(candidate) !== -1)
        {
          return false;
        }
      }

      return true;
    });

    if (candidatesNotInNeighboringSectors.length > 0)
    {
      candidates = candidatesNotInNeighboringSectors;
    }

    var candidatesByWeight:
    {
      [distributableName: string]: number;
    } = {};
    for (let j = 0; j < candidates.length; j++)
    {
      candidatesByWeight[candidates[j].type] =
        alreadyAddedByWeight[candidates[j].type];
    }


    var selectedKey = getRandomKeyWithWeights(candidatesByWeight);
    var selectedType = allDistributables[selectedKey];
    probabilityWeights[selectedKey]  /= 2;

    placerFunction(sector, selectedType);
    sector.addedDistributables.push(selectedType);
  }
}
export function addDefenceBuildings(star: Star, amount: number = 1, addSectorCommand: boolean = true)
{
  if (!star.owner)
  {
    console.warn("Tried to add defence buildings to star without owner.");
    return;
  }
  if (amount < 1)
  {
    return;
  }

  if (addSectorCommand)
  {
    star.addBuilding(new Building(
    {
      template: sectorCommand,
      location: star
    }));

    var amount = amount - 1;
  }

  for (let i = 0; i < amount; i++)
  {
    star.addBuilding(new Building(
    {
      template: starBase,
      location: star
    }));
  }
}
export function setupPirates(player: Player)
{
  player.name = "Pirates"
  player.color = Color.fromHex(0x000000);
  player.colorAlpha = 0;
  player.secondaryColor = Color.fromHex(0xFFFFFF);

  player.isIndependent = true;

  var foregroundEmblem = new Emblem(player.secondaryColor);
  foregroundEmblem.inner = Flag_of_Edward_England;

  player.flag = new Flag(
  {
    width: 46, // global FLAG_SIZE
    mainColor: player.color,
    secondaryColor: player.secondaryColor
  });

  player.flag.setForegroundEmblem(foregroundEmblem);
}
export function severLinksToNonAdjacentStars(star: Star)
{
  var allLinks = star.getAllLinks();

  var neighborVoronoiIds = star.voronoiCell.getNeighborIds();

  for (let i = 0; i < allLinks.length; i++)
  {
    var toSever = allLinks[i];

    if (neighborVoronoiIds.indexOf(toSever.voronoiId) === -1)
    {
      star.removeLink(toSever);
    }
  }
}
