/// <reference path="../star.ts" />

/// <reference path="sector2.ts" />
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
    export function partiallyCutLinks(stars: Star[], minConnections: number, maxCutsPerRegion: number)
    {
      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];
        var regionsAlreadyCut:
        {
          [regionId: number]: number;
        } = {};

        var neighbors = star.getAllLinks();

        if (neighbors.length <= minConnections) continue;

        for (var j = neighbors.length - 1; j >= 0; j--)
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
       */
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
    export function addDefenceBuildings(star: Star, amount: number = 1)
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

      star.addBuilding(new Building(
      {
        template: Templates.Buildings.sectorCommand,
        location: star
      }));

      for (var i = 1; i < amount; i++)
      {
        star.addBuilding(new Building(
        {
          template: Templates.Buildings.starBase,
          location: star
        }));
      }
    }
    export function setDistancesFromNearestPlayerOwnedStar(stars: Star[])
    {
      var playerOwnedStars: Star[] = [];

      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];
        if (star.owner && !star.owner.isIndependent)
        {
          playerOwnedStars.push(star);
        }
      }

      for (var i = 0; i < playerOwnedStars.length; i++)
      {
        var ownedStarToCheck = playerOwnedStars[i];
        for (var j = 0; j < stars.length; j++)
        {
          var star = stars[j];
          var distance = star.getDistanceToStar(ownedStarToCheck);

          if (!isFinite(star.mapGenData.distanceFromNearestPlayerOwnedStar))
          {
            star.mapGenData.distanceFromNearestPlayerOwnedStar = distance;
          }
          else
          {
            star.mapGenData.distanceFromNearestPlayerOwnedStar =
              Math.min(distance, star.mapGenData.distanceFromNearestPlayerOwnedStar)
          }
        }
      }
    }
    export function setupPirates(stars: Star[], player: Player,
      variance: number = 0.33, intensity: number = 1)
    {
      var minShips = 2;
      var maxShips = 6;

      setDistancesFromNearestPlayerOwnedStar(stars);

      for (var i = 0; i < stars.length; i++)
      {
        var star = stars[i];

        if (!star.owner)
        {
          player.addStar(star);
          addDefenceBuildings(star, 1);

          var distance = star.mapGenData.distanceFromNearestPlayerOwnedStar;

          var shipAmount = minShips;

          for (var j = 2; j < distance; j++)
          {
            shipAmount += (1 - variance + Math.random() * distance * variance) * intensity;

            if (shipAmount >= maxShips)
            {
              shipAmount = maxShips;
              break;
            }
          }

          var ships = [];
          for (var j = 0; j < shipAmount; j++)
          {
            var ship = makeRandomShip();
            player.addUnit(ship);
            ships.push(ship);
          }
          var fleet = new Fleet(player, ships, star);
        }
      }
    }
  }
}
