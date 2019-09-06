import {Building} from "core/building/Building";
import {Region} from "core/map/Region";
import {Star} from "core/map/Star";
import
{
  aStar,
} from "core/map/pathFinding";
import {Distributable} from "core/generic/Distributable";
import
{
  getRandomKeyWithWeights,
  getRelativeWeightsFromObject,
} from "core/generic/utility";
import
{
  sectorCommand,
  starBase,
} from "modules/space/buildings/templates/territoryBuildings";

import {MapGenDataByStarId} from "./MapGenDataByStarId";
import {triangulate} from "./triangulate";


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

  const triangles = triangulate(stars);

  for (let i = 0; i < triangles.length; i++)
  {
    const edges: Star[][] = triangles[i].getEdges();
    for (let j = 0; j < edges.length; j++)
    {
      edges[j][0].addLink(edges[j][1]);
    }
  }
}

export function partiallySeverLinks(
  stars: Star[],
  mapGenDataByStarId: MapGenDataByStarId,
  minConnectionsToKeep: number,
  maxCuts: number,
): void
{
  stars.forEach(star =>
  {
    let cutsDone = 0;

    const neighbors = star.getAllLinks();
    const distanceFromCenter = mapGenDataByStarId[star.id].distanceFromCenter;

    if (neighbors.length > minConnectionsToKeep)
    {
      for (let j = neighbors.length - 1; j >= 0; j--)
      {
        const neighbor = neighbors[j];

        if (cutsDone < maxCuts)
        {
          const neighborLinks = neighbor.getAllLinks();

          if (neighbors.length <= minConnectionsToKeep || neighborLinks.length <= minConnectionsToKeep)
          {
            continue;
          }

          const totalLinks = neighbors.length + neighborLinks.length;

          let cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnectionsToKeep) * (1 - distanceFromCenter);
          const minMultipleCutThreshhold = 0.15;
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

              const path = aStar(star, neighbor);

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
  const linkedByRange = star.getLinkedInRange(maxRange).byRange;
  for (const rangeString in linkedByRange)
  {
    const range = parseInt(rangeString);
    connectedness += linkedByRange[rangeString].length / range;
  }

  return connectedness;
}
export function makeSectors(
  stars: Star[],
  mapGenDataByStarId: MapGenDataByStarId,
  minSize: number,
  maxSize: number,
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

  let sectorIdGen = 0;
  const sectorsById:
  {
    [sectorId: number]: Region;
  } = {};
  const sectorsByStarId:
  {
    [starId: number]: Region;
  } = {};

  const unassignedStars: Star[] = stars.slice(0);
  const leftoverStars: Star[] = [];

  unassignedStars.sort((a, b) =>
  {
    return mapGenDataByStarId[b.id].connectedness - mapGenDataByStarId[a.id].connectedness;
  });

  while (averageSectorsAmount > 0 && unassignedStars.length > 0)
  {
    const seedStar = unassignedStars.pop();
    const islandForSameSector = Star.getIslandForQualifier([seedStar], null, (a, b) =>
    {
      return sectorsByStarId[a.id] === sectorsByStarId[b.id];
    });

    const canFormMinSizeSector = islandForSameSector.length >= minSize;

    if (canFormMinSizeSector)
    {
      const sectorId = sectorIdGen++;

      const sector = new Region("sector_" + sectorId);
      sectorsById[sectorId] = sector;

      let discoveryStarIndex = 0;
      sector.addStar(seedStar);
      sectorsByStarId[seedStar.id] = sector;

      while (sector.stars.length < minSize)
      {
        const discoveryStar = sector.stars[discoveryStarIndex];

        const discoveryStarLinkedNeighbors = discoveryStar.getLinkedInRange(1).all;
        const frontier = discoveryStarLinkedNeighbors.filter(star =>
        {
          const starHasSector = Boolean(sectorsByStarId[star.id]);

          return !starHasSector;
        });

        while (sector.stars.length < minSize && frontier.length > 0)
        {
          const frontierSortScores:
          {
            [starId: number]: number;
          } = {};

          frontier.forEach(star =>
          {
            const borderLengthWithSector = sector.getBorderLengthWithStars([star]);
            const borderScore = borderLengthWithSector / 15;

            const connectedness = mapGenDataByStarId[star.id].connectedness;

            frontierSortScores[star.id] = borderScore - connectedness;
          });

          frontier.sort((a, b) =>
          {
            return frontierSortScores[b.id] - frontierSortScores[a.id];
          });

          const toAdd = frontier.pop();
          unassignedStars.splice(unassignedStars.indexOf(toAdd), 1);

          sector.addStar(toAdd);
          sectorsByStarId[toAdd.id] = sector;
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
    const star = leftoverStars.pop();

    const neighbors: Star[] = star.getLinkedInRange(1).all;
    const alreadyAddedNeighborSectors:
    {
      [sectorId: number]: boolean;
    } = {};
    const candidateSectors: Region[] = [];

    neighbors.forEach(neighbor =>
    {
      const neighborSector = sectorsByStarId[neighbor.id];
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

        const unclaimedSectorLinkedStars = sectorLinkedStars.filter(linkedStar =>
        {
          return !sectorsByStarId[linkedStar.id];
        });

        unclaimedNeighborsPerSector[sector.id] = unclaimedSectorLinkedStars.length;
      });

      candidateSectors.sort((a, b) =>
      {
        const sizeSort = a.stars.length - b.stars.length;
        if (sizeSort) { return sizeSort; }

        const unclaimedSort = unclaimedNeighborsPerSector[b.id] -
          unclaimedNeighborsPerSector[a.id];
        if (sizeSort) { return unclaimedSort; }

        const perimeterSort = b.getBorderLengthWithStars([star]) - a.getBorderLengthWithStars([star]);
        if (perimeterSort) { return perimeterSort; }

        return a.id.localeCompare(b.id);
      });

      candidateSectors[0].addStar(star);
      sectorsByStarId[star.id] = candidateSectors[0];
    }
  }

  return Object.keys(sectorsById).map(sectorId =>
  {
    return sectorsById[sectorId];
  });
}
// export function setSectorDistributionFlags(sectors: Sector[])
// {
//   for (let i = 0; i < sectors.length; i++)
//   {
//     const sector = sectors[i];
//     sector.distributionFlags = [];
//     const majorityRegions = sector.getMajorityRegions();
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
  distributionFlagsBySectorId: {[sectorId: string]: string[]},
  distributablesByDistributionGroup: {[groupName: string]: T[]},
  placerFunction: (sector: Region, distributable: T) => void,
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

  const addedDistributablesByRegionId:
  {
    [regionId: string]:
    {
      [distributableName: string]: boolean;
    };
  } = {};

  for (const distributionGroup in distributablesByDistributionGroup)
  {
    const distributables = distributablesByDistributionGroup[distributionGroup];
    distributables.forEach(distributable =>
    {
      probabilityWeights[distributable.type] = distributable.distributionData.weight;
      allDistributablesByType[distributable.type] = distributable;
    });
  }

  sectors.forEach(sector =>
  {
    const alreadyAddedByWeight = getRelativeWeightsFromObject(probabilityWeights);
    const distributionFlags = distributionFlagsBySectorId[sector.id];
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
        return(addedDistributablesByRegionId[linkedRegion.id] &&
          addedDistributablesByRegionId[linkedRegion.id][candidate.type]);
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

    if (!addedDistributablesByRegionId[sector.id])
    {
      addedDistributablesByRegionId[sector.id] = {};
    }
    addedDistributablesByRegionId[sector.id][selectedKey] = true;
  });
}
export function addTerritoryBuildings(star: Star, amount: number = 1, addSectorCommand: boolean = true)
{
  let buildingsToAdd = amount;
  if (!star.owner)
  {
    console.warn("Tried to add defence buildings to star without owner.");

    return;
  }
  if (buildingsToAdd < 1)
  {
    return;
  }

  if (addSectorCommand)
  {
    star.buildings.add(new Building(
    {
      template: sectorCommand,
      location: star,
    }));

    buildingsToAdd -= 1;
  }

  for (let i = 0; i < buildingsToAdd; i++)
  {
    star.buildings.add(new Building(
    {
      template: starBase,
      location: star,
    }));
  }
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
