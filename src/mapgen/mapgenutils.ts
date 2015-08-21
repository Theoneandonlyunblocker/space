/// <reference path="../star.ts" />

/// <reference path="triangulation.ts" />

module Rance
{
  export module MapGen2
  {
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

      for (var i = 0; i < triangles.length; i++)
      {
        var edges = <Star[][]> triangles[i].getEdges();
        for (var j = 0; j < edges.length; j++)
        {
          edges[j][0].addLink(edges[j][1]);
        }
      }
    }
    export function partiallyCutLinks(stars: Star[], minConnections: number)
    {
      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];

        var neighbors = star.getAllLinks();

        if (neighbors.length < minConnections) continue;

        for (var j = 0; j < neighbors.length; j++)
        {
          var neighbor = neighbors[j];
          var neighborLinks = neighbor.getAllLinks();

          //if (neighborLinks.length < minConnections) continue;

          var totalLinks = neighbors.length + neighborLinks.length;

          var cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnections) * (1 - star.mapGenData.distance);
          var minMultipleCutThreshhold = 0.15;
          while (cutThreshhold > 0)
          {
            if (Math.random() < cutThreshhold)
            {
              star.removeLink(neighbor);

              var path = aStar(star, neighbor);

              if (!path) // left star inaccesible
              {
                star.addLink(neighbor);
              }
            }

            cutThreshhold -= minMultipleCutThreshhold;
          }
        }
      }
    }
    export function makeSectors(stars: Star[], minSize: number, maxSize: number)
    {
      var totalStars = stars.length;
      var unassignedStars: Star[] = stars.slice(0);
      var leftoverStars: Star[] = [];
      
      var averageSize = (minSize + maxSize) / 2;
      var averageSectorsAmount = Math.round(totalStars / averageSize);

      var sectorsById:
      {
        [sectorId: number]: Sector2;
      } = {};
      var sectorIdGen = 0;

      var sameSectorFN = function(a, b)
      {
        return a.mapGenData.sector === b.mapGenData.sector;
      };

      while (averageSectorsAmount > 0 && unassignedStars.length > 0)
      {
        var seedStar = unassignedStars.pop();
        var canFormMinSizeSector = seedStar.getIslandForQualifier(sameSectorFN, minSize).length >= minSize;

        if (canFormMinSizeSector)
        {
          var sector = new Sector2(sectorIdGen++);
          sectorsById[sector.id] = sector;

          var discoveryStarIndex = 0;
          sector.addStar(seedStar);

          while (sector.stars.length < minSize)
          {
            var discoveryStar = sector.stars[discoveryStarIndex];

            var frontier = discoveryStar.getLinkedInRange(1).all;
            frontier = frontier.filter(function(star)
            {
              return !star.mapGenData.sector;
            });

            while (sector.stars.length < minSize && frontier.length > 0)
            {
              var randomFrontierKey = getRandomArrayKey(frontier);
              var toAdd = frontier.splice(randomFrontierKey, 1)[0];
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
        var candidateSectors: Sector2[] = [];

        for (var j = 0; j < neighbors.length; j++)
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

        for (var j = 0; j < candidateSectors.length; j++)
        {
          var sectorNeighbors = candidateSectors[j].getNeighboringStars();
          var unclaimed = 0;
          for (var k = 0; k < sectorNeighbors.length; k++)
          {
            if (!sectorNeighbors[k].mapGenData.sector)
            {
              unclaimed++;
            }
          }

          unclaimedNeighborsPerSector[candidateSectors[j].id] = unclaimed;
        }

        candidateSectors.sort(function(a, b)
        {
          var sizeSort = a.stars.length - b.stars.length;
          if (sizeSort) return sizeSort;

          var unclaimedSort = unclaimedNeighborsPerSector[b.id] -
            unclaimedNeighborsPerSector[a.id];
          return unclaimedSort;
        });

        candidateSectors[0].addStar(star);
      }

      return sectorsById;
    }
  }
}
