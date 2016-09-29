import
{
  sectorCommand,
  starBase
} from "../../defaultbuildings/templates/Templates";
import
{
  Flag_of_Edward_England
} from "../../defaultemblems/SubEmblemTemplates";
import federationAlliance from "../../defaultraces/templates/federationAlliance";

import triangulate from "./triangulate";
import MapGenDataByStarID from "./MapGenDataByStarID";

import Region from "../../../src/Region";
import Star from "../../../src/Star";
import Name from "../../../src/Name";
import Building from "../../../src/Building";
import Player from "../../../src/Player";
import Color from "../../../src/Color";
import Emblem from "../../../src/Emblem";
import Flag from "../../../src/Flag";
import
{
  aStar
} from "../../../src/pathFinding";
import
{
  getRelativeWeightsFromObject,
  getRandomKeyWithWeights
} from "../../../src/utility";

import Distributable from "../../../src/templateinterfaces/Distributable";


export function linkStarsByTriangulation(stars: Star[]): void
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
    var edges: Star[][] = triangles[i].getEdges();
    for (let j = 0; j < edges.length; j++)
    {
      edges[j][0].addLink(edges[j][1]);
    }
  }
}

export function partiallySeverLinks(
  stars: Star[],
  mapGenDataByStarID: MapGenDataByStarID,
  minConnectionsToKeep: number,
  maxCuts: number
): void
{
  stars.forEach(star =>
  {
    let cutsDone = 0;
    
    var neighbors = star.getAllLinks();
    const mapGenDistance = mapGenDataByStarID[star.id].mapGenDistance;

    if (neighbors.length > minConnectionsToKeep)
    {
      for (let j = neighbors.length - 1; j >= 0; j--)
      {
        var neighbor = neighbors[j];

        if (cutsDone < maxCuts)
        {
          var neighborLinks = neighbor.getAllLinks();

          if (neighbors.length <= minConnectionsToKeep || neighborLinks.length <= minConnectionsToKeep) continue;

          var totalLinks = neighbors.length + neighborLinks.length;

          var cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnectionsToKeep) * (1 - mapGenDistance);
          var minMultipleCutThreshhold = 0.15;
          if (cutThreshhold > 0)
          {
            if (Math.random() < cutThreshhold)
            {
              star.removeLink(neighbor);
              neighbors.pop();

              if (!cutsDone)
              {
                cutsDone = 0;
              }
              cutsDone++;

              var path = aStar(star, neighbor);

              if (!path) // left star inaccesible
              {
                star.addLink(neighbor);
                cutsDone--;
                neighbors.push(neighbor);
              }
            }

            cutThreshhold -= minMultipleCutThreshhold;
          }
        }
      }
    }
  });
}

export function getStarConnectedness(star: Star, maxRange: number): number
{
  let connectedness: number = 0;
  let linkedByRange = star.getLinkedInRange(maxRange).byRange;
  for (let rangeString in linkedByRange)
  {
    const range = parseInt(rangeString);
    connectedness += linkedByRange[rangeString].length / range;
  }
  
  return connectedness;
}
export function makeSectors(
  stars: Star[],
  mapGenDataByStarID: MapGenDataByStarID,
  minSize: number,
  maxSize: number
): Region[]
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
    if neighboring leftovers equal, assing to sector with biggest perimeter with leftover

  for each sector larger than maxSize
    assign extra stars to smaller neighboring sectors
   */
  const totalStars = stars.length;
  const averageSize = (minSize + maxSize) / 2;
  const averageSectorsAmount = Math.round(totalStars / averageSize);
  
  let sectorIDGen = 0;
  const sectorsByID:
  {
    [sectorId: number]: Region;
  } = {};
  const sectorsByStarID:
  {
    [starID: number]: Region;
  } = {};

  const unassignedStars: Star[] = stars.slice(0);
  const leftoverStars: Star[] = [];

  unassignedStars.sort((a, b) =>
  {
    return mapGenDataByStarID[b.id].connectedness - mapGenDataByStarID[a.id].connectedness;
  })

  while (averageSectorsAmount > 0 && unassignedStars.length > 0)
  {
    const seedStar = unassignedStars.pop();
    const islandForSameSector = seedStar.getIslandForQualifier((a, b) =>
    {
      return sectorsByStarID[a.id] === sectorsByStarID[b.id];
    }, minSize);
    
    const canFormMinSizeSector = islandForSameSector.length >= minSize;

    if (canFormMinSizeSector)
    {
      const sectorID = sectorIDGen++;
      
      const sector = new Region("sector_" + sectorID);
      sectorsByID[sectorID] = sector;

      let discoveryStarIndex = 0;
      sector.addStar(seedStar);
      sectorsByStarID[seedStar.id] = sector;

      while (sector.stars.length < minSize)
      {
        const discoveryStar = sector.stars[discoveryStarIndex];

        const discoveryStarLinkedNeighbors = discoveryStar.getLinkedInRange(1).all;
        const frontier = discoveryStarLinkedNeighbors.filter(star =>
        {
          const starHasSector = Boolean(sectorsByStarID[star.id]);
          return !starHasSector;
        });

        while (sector.stars.length < minSize && frontier.length > 0)
        {
          const frontierSortScores:
          {
            [starId: number]: number
          } = {};
          
          frontier.forEach(star =>
          {
            const borderLengthWithSector = sector.getBorderLengthWithStars([star]);
            const borderScore = borderLengthWithSector / 15;
            
            const connectedness = mapGenDataByStarID[star.id].connectedness;
            
            frontierSortScores[star.id] = borderScore - connectedness;
          });

          frontier.sort(function(a: Star, b: Star)
          {
            return frontierSortScores[b.id] - frontierSortScores[a.id];
          });

          var toAdd = frontier.pop();
          unassignedStars.splice(unassignedStars.indexOf(toAdd), 1);

          sector.addStar(toAdd);
          sectorsByStarID[toAdd.id] = sector;
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
    var candidateSectors: Region[] = [];

    neighbors.forEach(neighbor =>
    {
      const neighborSector = sectorsByStarID[neighbor.id];
      if (neighborSector)
      {
        if (!alreadyAddedNeighborSectors[neighborSector.id])
        {
          alreadyAddedNeighborSectors[neighborSector.id] = true;
          candidateSectors.push(neighborSector);
        }
      }
    });

    // no neigboring star is part of a sector
    // put star at back of queue and try again later
    if (candidateSectors.length < 1)
    {
      leftoverStars.unshift(star);
      continue;
    }
    else
    {
      const unclaimedNeighborsPerSector:
      {
        [sectorId: string]: number;
      } = {};
      
      candidateSectors.forEach(sector =>
      {
        const sectorLinkedStars = sector.getLinkedStars();
        
        const unclaimedSectorLinkedStars = sectorLinkedStars.filter(star =>
        {
          return !sectorsByStarID[star.id];
        });
        
        unclaimedNeighborsPerSector[sector.id] = unclaimedSectorLinkedStars.length;
      });
      
      candidateSectors.sort((a, b) =>
      {
        const sizeSort = a.stars.length - b.stars.length;
        if (sizeSort) return sizeSort;

        const unclaimedSort = unclaimedNeighborsPerSector[b.id] -
          unclaimedNeighborsPerSector[a.id];
        if (sizeSort) return unclaimedSort;

        const perimeterSort = b.getBorderLengthWithStars([star]) - a.getBorderLengthWithStars([star]);
        if (perimeterSort) return perimeterSort;

        return a.id.localeCompare(b.id);
      });

      candidateSectors[0].addStar(star);
      sectorsByStarID[star.id] = candidateSectors[0];
    }
  }

  return Object.keys(sectorsByID).map(sectorID =>
  {
    return sectorsByID[sectorID];
  });
}
// export function setSectorDistributionFlags(sectors: Sector[])
// {
//   for (let i = 0; i < sectors.length; i++)
//   {
//     var sector = sectors[i];
//     sector.distributionFlags = [];
//     var majorityRegions = sector.getMajorityRegions();
//     for (let j = 0; j < majorityRegions.length; j++)
//     {
//       if (majorityRegions[j].id.indexOf("center") !== -1)
//       {
//         sector.distributionFlags.push("rare");
//       }
//       else
//       {
//         sector.distributionFlags.push("common");
//       }
//     }
//   }
// }
export function distributeDistributablesPerSector<T extends Distributable>(
  sectors: Region[],
  distributionFlagsBySectorID: {[sectorID: string]: string[]},
  distributablesByDistributionGroup: {[groupName: string]: T[]},
  placerFunction: (sector: Region, distributable: T) => void
): void
{
  const probabilityWeights:
  {
    [distributableName: string]: number;
  } = {};
  const allDistributablesByType:
  {
    [distributableName: string]: T;
  } = {};
  
  const addedDistributablesByRegionID:
  {
    [regionID: string]:
    {
      [distributableName: string]: boolean;
    }
  } = {};
  
  for (let distributionGroup in distributablesByDistributionGroup)
  {
    const distributables = distributablesByDistributionGroup[distributionGroup];
    distributables.forEach(distributable =>
    {
      probabilityWeights[distributable.type] = distributable.rarity;
      allDistributablesByType[distributable.type] = distributable;
    });
  }

  sectors.forEach(sector =>
  {
    const alreadyAddedByWeight = getRelativeWeightsFromObject(probabilityWeights);
    const distributionFlags = distributionFlagsBySectorID[sector.id];
    const distributablesForSector = distributionFlags.reduce((distributables: T[], flag: string) =>
    {
      return distributables.concat(distributablesByDistributionGroup[flag]);
    }, []);

    if (distributablesForSector.length < 1)
    {
      return;
    }

    const linkedNeighborRegions = sector.getLinkedRegions(sectors);
    const candidatesNotInNeighboringSectors = distributablesForSector.filter(candidate =>
    {
      return linkedNeighborRegions.some(linkedRegion =>
      {
        return(addedDistributablesByRegionID[linkedRegion.id] &&
          addedDistributablesByRegionID[linkedRegion.id][candidate.type]);
      });
    });
    
    const candidates = candidatesNotInNeighboringSectors.length > 0 ?
      candidatesNotInNeighboringSectors :
      distributablesForSector;

    const candidatesByWeight:
    {
      [distributableName: string]: number;
    } = {};
    
    candidates.forEach(candidate =>
    {
      candidatesByWeight[candidate.type] = alreadyAddedByWeight[candidate.type];
    });

    const selectedKey = getRandomKeyWithWeights(candidatesByWeight);
    const selectedType = allDistributablesByType[selectedKey];
    probabilityWeights[selectedKey] /= 2;

    placerFunction(sector, selectedType);
    
    if (!addedDistributablesByRegionID[sector.id])
    {
      addedDistributablesByRegionID[sector.id] = {};
    }
    addedDistributablesByRegionID[sector.id][selectedKey] = true;
  });
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
export function makePlayerForPirates(): Player
{
  const color =
  {
    main: Color.fromHex(0x000000),
    alpha: 0,
    secondary: Color.fromHex(0xFFFFFF)
  };

  const flag = new Flag(color.main);

  const foregroundEmblem = new Emblem([color.secondary], Flag_of_Edward_England);
  flag.addEmblem(foregroundEmblem);

  const player = new Player(
  {
    isAI: true,
    isIndependent: true,
    name: new Name("Pirates", true),
    
    race: federationAlliance,
    money: -9999,

    color: color,

    flag: flag
  });

  return player;
}
export function severLinksToNonAdjacentStars(star: Star)
{
  const allLinks = star.getAllLinks();
  const neighbors = star.getNeighbors();

  allLinks.forEach(linkedStar =>
  {
    if (neighbors.indexOf(linkedStar) === -1)
    {
      star.removeLink(linkedStar);
    }
  });
}
