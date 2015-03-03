/// <reference path="../lib/voronoi.d.ts" />

/// <reference path="../data/templates/mapgentemplates.ts" />

/// <reference path="triangulation.ts" />
/// <reference path="triangle.ts" />
/// <reference path="star.ts" />
/// <reference path="region.ts" />
/// <reference path="sector.ts" />
/// <reference path="utility.ts" />
/// <reference path="pathfinding.ts"/>

module Rance
{
  export class MapGen
  {
    maxWidth: number;
    maxHeight: number;
    points: Star[] = [];
    players: Player[];
    independents: Player;
    regions:
    {
      [id: string]: Region;
    } = {};
    sectors:
    {
      [id: number]: Sector;
    };
    triangles: Triangle[] = [];
    voronoiDiagram: any;

    nonFillerVoronoiLines:
    {
      [visibility: string]: any[];
    } = {};
    nonFillerPoints: Star[];

    galaxyConstructors:
    {
      [type: string]: (any) => Star[];
    } = {};

    startLocations: Star[] = [];

    constructor()
    {
      this.galaxyConstructors =
      {
        spiral: this.makeSpiralPoints
      }
    }
    reset()
    {
      this.points = [];
      this.regions = {};
      this.triangles = [];
      this.voronoiDiagram = null;

      this.nonFillerPoints = [];
      this.nonFillerVoronoiLines = {};
    }
    makeMap(options:
    {
      mapOptions:
      {
        width: number;
        height?: number;
      };
      starGeneration:
      {
        galaxyType: string;
        totalAmount: number;
        arms: number;
        centerSize: number;
        amountInCenter: number;
      };
      relaxation:
      {
        timesToRelax: number;
        dampeningFactor: number;
      };
    })
    {
      this.reset();

      this.maxWidth = options.mapOptions.width;
      this.maxHeight = options.mapOptions.height || this.maxWidth;

      this.points = this.generatePoints(options.starGeneration);

      this.makeVoronoi();
      this.relaxPoints(options.relaxation);

      this.triangulate();
      this.severArmLinks();
      this.partiallyCutConnections(4);

      var isConnected = this.isConnected();
      if (!isConnected)
      {
        return this.makeMap(options);
      }

      this.sectors = this.makeSectors(3, 5);
      this.setResources();

      this.setPlayers();
      this.setDistanceFromStartLocations();

      this.setupPirates();

      return this;
    }
    isConnected()
    {
      var initialPoint = this.getNonFillerPoints()[0];

      return initialPoint.getLinkedInRange(9999).all.length === this.nonFillerPoints.length;
    }
    setPlayers()
    {
      var regionNames = Object.keys(this.regions);
      var startRegions = regionNames.filter(function(name)
      {
        return name.indexOf("arm") !== -1;
      });


      for (var i = 0; i < this.players.length; i++)
      {
        var player = this.players[i];
        var regionName = startRegions[i];

        var location = this.getFurthestPointInRegion(this.regions[regionName]);

        location.owner = player;
        player.addStar(location);
        var sectorCommand = new Building(
        {
          template: Templates.Buildings.sectorCommand,
          location: location
        });
        location.addBuilding(sectorCommand);

        location.addBuilding(new Building(
        {
          template: Templates.Buildings.starBase,
          location: location
        }));

        this.startLocations.push(location);

        var ship = new Unit(Templates.ShipTypes.battleCruiser);
        player.addUnit(ship);

        var fleet = new Fleet(player, [ship], location);
      }
    }
    setDistanceFromStartLocations()
    {
      var nonFillerPoints = this.getNonFillerPoints();

      for (var i = 0; i < this.startLocations.length; i++)
      {
        var startLocation = this.startLocations[i];
        for (var j = 0; j < nonFillerPoints.length; j++)
        {
          var star = nonFillerPoints[j];

          var distance = star.getDistanceToStar(startLocation);


          if (!isFinite(star.distanceFromNearestStartLocation))
          {
            star.distanceFromNearestStartLocation = distance;
          }
          else
          {
            star.distanceFromNearestStartLocation =
              Math.min(distance, star.distanceFromNearestStartLocation)
          }
        }
      }
    }

    setupPirates()
    {
      var nonFillerPoints = this.getNonFillerPoints();
      var minShips = 2;
      var maxShips = 8;
      var player = this.independents;

      for (var i = 0; i < nonFillerPoints.length; i++)
      {
        var star = nonFillerPoints[i];

        if (!star.owner)
        {
          star.owner = player;
          player.addStar(star);
          var sectorCommand = new Building(
          {
            template: Templates.Buildings.sectorCommand,
            location: star
          });
          star.addBuilding(sectorCommand);

          var shipAmount = minShips;
          var distance = star.distanceFromNearestStartLocation;

          for (var j = 2; j < distance; j++)
          {
            if (shipAmount >= maxShips) break;

            shipAmount += randInt(0, 1);
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

    generatePoints(options:
    {
      galaxyType: string;
      totalAmount: number;
      arms: number;
      centerSize: number;
      amountInCenter: number;
    })
    {
      var amountInArms = 1 - options.amountInCenter;

      var starGenerationProps =
      {
        amountPerArm: options.totalAmount / options.arms * amountInArms,
        arms: options.arms,
        amountInCenter: options.totalAmount * options.amountInCenter,
        centerSize: options.centerSize
      }

      var galaxyConstructor =
        this.galaxyConstructors[options.galaxyType];

      return galaxyConstructor.call(this, starGenerationProps);
    }
    makeRegion(name: string, isFiller: boolean)
    {
      this.regions[name] = new Region(name, [], isFiller);
      return this.regions[name];
    }
    makeSpiralPoints(props:
    {
      amountPerArm: number;
      arms: number;
      amountInCenter: number;
      centerSize?: number;
      armOffsetMax?: number;
    })
    {
      var totalArms = props.arms * 2;
      var amountPerArm = props.amountPerArm;
      var amountPerFillerArm = amountPerArm / 2;

      var amountInCenter = props.amountInCenter;
      var centerThreshhold = props.centerSize || 0.35;

      var points = [];
      var armDistance = Math.PI * 2 / totalArms;
      var armOffsetMax = props.armOffsetMax || 0.5;
      var armRotationFactor = props.arms / 3;
      var galaxyRotation = randRange(0, Math.PI * 2);
      var minBound = Math.min(this.maxWidth, this.maxHeight);
      var minBound2 = minBound / 2;


      var makePoint = function makePointFN(distanceMin, distanceMax, region, armOffsetMax)
      {
        var distance = randRange(distanceMin, distanceMax);
        var offset = Math.random() * armOffsetMax - armOffsetMax / 2;
        offset *= (1 / distance);

        if (offset < 0) offset = Math.pow(offset, 2) * -1;
        else offset = Math.pow(offset, 2);

        var armRotation = distance * armRotationFactor;
        var angle = arm * armDistance + galaxyRotation + offset + armRotation;

        var x = Math.cos(angle) * distance * this.maxWidth + this.maxWidth;
        var y = Math.sin(angle) * distance * this.maxHeight + this.maxHeight;

        var point = new Star(x, y);

        point.distance = distance;
        region.addStar(point);
        point.baseIncome = randInt(2, 10) * 10;

        return point;
      }.bind(this);

      var centerRegion = this.makeRegion("center", false);
      

      var currentArmIsFiller = false;
      for (var i = 0; i < totalArms; i++)
      {
        var arm = i;
        var regionName = (currentArmIsFiller ? "filler_" : "arm_") + arm;
        var region = this.makeRegion(regionName, currentArmIsFiller);
        var amountForThisArm = currentArmIsFiller ? amountPerFillerArm : amountPerArm;
        var maxOffsetForThisArm = currentArmIsFiller ? armOffsetMax / 2 : armOffsetMax;

        var amountForThisCenter = Math.round(amountInCenter / totalArms);

        for (var j = 0; j < amountForThisArm; j++)
        {
          var point = makePoint(centerThreshhold, 1, region, maxOffsetForThisArm);

          points.push(point);
        }

        for (var j = 0; j < amountForThisCenter; j++)
        {
          var point = makePoint(0, centerThreshhold, centerRegion, armOffsetMax);
          points.push(point);
        }

        currentArmIsFiller = !currentArmIsFiller;
      }

      return points;
    }
    triangulate()
    {
      if (!this.points || this.points.length < 3) throw new Error();
      var triangulationData = triangulate(this.points);
      this.triangles = this.cleanTriangles(triangulationData.triangles,
        triangulationData.superTriangle);

      this.makeLinks();
    }
    clearLinks()
    {
      for (var i = 0; i < this.points.length; i++)
      {
        this.points[i].clearLinks();
      }
    }
    makeLinks()
    {
      if (!this.triangles || this.triangles.length < 1) throw new Error();

      this.clearLinks();

      for (var i = 0; i < this.triangles.length; i++)
      {
        var edges = <Star[][]> this.triangles[i].getEdges();
        for (var j = 0; j < edges.length; j++)
        {
          edges[j][0].addLink(edges[j][1]);
        }
      }
    }
    severArmLinks()
    {
      for (var i = 0; i < this.points.length; i++)
      {
        var star = this.points[i];
        star.severLinksToFiller();
        star.severLinksToNonAdjacent();

        if (star.distance > 0.8)
        {
          star.severLinksToNonCenter();
        }
      }
    }
    makeVoronoi()
    {
      if (!this.points || this.points.length < 3) throw new Error();

      var boundingBox =
      {
        xl: 0,
        xr: this.maxWidth * 2,
        yt: 0,
        yb: this.maxHeight * 2
      };

      var voronoi = new Voronoi();

      var diagram = voronoi.compute(this.points, boundingBox);

      this.voronoiDiagram = diagram;

      for (var i = 0; i < diagram.cells.length; i++)
      {
        var cell = diagram.cells[i];
        cell.site.voronoiCell = cell;
        cell.site.voronoiCell.vertices = this.getVerticesFromCell(cell)
      }
    }
    cleanTriangles(triangles: Triangle[], superTriangle: Triangle)
    {
      for (var i = triangles.length - 1; i >= 0; i--)
      {
        if (triangles[i].getAmountOfSharedVerticesWith(superTriangle))
        {
          triangles.splice(i, 1);
        }
      }

      return triangles;
    }
    getVerticesFromCell(cell: any)
    {
      var vertices = [];

      for (var i = 0; i < cell.halfedges.length; i++)
      {
        vertices.push(cell.halfedges[i].getStartpoint());
      }

      return vertices;
    }
    relaxPointsOnce(dampeningFactor: number = 0)
    {
      var relaxedPoints = [];

      for (var i = 0; i < this.voronoiDiagram.cells.length; i++)
      {
        var cell = this.voronoiDiagram.cells[i];
        var point = cell.site;
        var vertices = this.getVerticesFromCell(cell);
        var centroid = getCentroid(vertices);
        var timesToDampen = point.distance * dampeningFactor;

        for (var j = 0; j < timesToDampen; j++)
        {
          centroid.x = (centroid.x + point.x) / 2;
          centroid.y = (centroid.y + point.y) / 2;
        }

        point.setPosition(centroid.x, centroid.y);
      }
    }
    relaxPoints(options:
      {
        timesToRelax: number;
        dampeningFactor: number;
      })
    {
      if (!this.points) throw new Error();

      if (!this.voronoiDiagram) this.makeVoronoi();

      for (var i = 0; i < options.timesToRelax; i++)
      {
        this.relaxPointsOnce(options.dampeningFactor);
        this.makeVoronoi();
      }
    }
    getNonFillerPoints()
    {
      if (!this.points) return [];
      if (!this.nonFillerPoints || this.nonFillerPoints.length <= 0)
      {
        this.nonFillerPoints = this.points.filter(function(point)
        {
          return !point.region.isFiller;
        });
      }

      return this.nonFillerPoints;
    }
    getNonFillerVoronoiLines(visibleStars?: Star[])
    {
      if (!this.voronoiDiagram) return [];

      var indexString = "";
      if (!visibleStars) indexString = "all";
      else
      {
        var ids: number[] = visibleStars.map(function(star){return star.id});
        ids = ids.sort();

        indexString = ids.join();
      }

      if (!this.nonFillerVoronoiLines[indexString] ||
        this.nonFillerVoronoiLines[indexString].length <= 0)
      {
        console.log("newEdgesIndex")
        this.nonFillerVoronoiLines[indexString] =
          this.voronoiDiagram.edges.filter(function(edge)
        {
          var adjacentSites = [edge.lSite, edge.rSite];
          var adjacentFillerSites = 0;
          var maxAllowedFillerSites = 2;

          for (var i = 0; i < adjacentSites.length; i++)
          {
            var site = adjacentSites[i];

            if (!site)
            {
              // draw all border edges
              //return true;

              // draw all non filler border edges
              maxAllowedFillerSites--;
              if (adjacentFillerSites >= maxAllowedFillerSites)
              {
                return false;
              }
              continue;
            };


            if (visibleStars && visibleStars.indexOf(site) < 0)
            {
              maxAllowedFillerSites--;
              if (adjacentFillerSites >= maxAllowedFillerSites)
              {
                return false;
              }
              continue;
            };


            if (site.region.isFiller)
            {
              adjacentFillerSites++;
              if (adjacentFillerSites >= maxAllowedFillerSites)
              {
                return false;
              }
            };
          }

          return true;
        });
      }

      return this.nonFillerVoronoiLines[indexString];
    }
    getFurthestPointInRegion(region: Region): Star
    {
      var furthestDistance = 0;
      var furthestStar: Star = null;

      for (var i = 0; i < region.stars.length; i++)
      {
        if (region.stars[i].distance > furthestDistance)
        {
          furthestStar = region.stars[i];
          furthestDistance = region.stars[i].distance;
        }
      }

      return furthestStar;
    }
    partiallyCutConnections(minConnections: number)
    {
      var points = this.getNonFillerPoints();
      var cuts = 0;
      var noCuts = 0;
      var reverts = 0;

      for (var i = 0; i < points.length; i++)
      {
        var point = points[i];

        var neighbors = point.getAllLinks();

        if (neighbors.length < minConnections) continue;

        for (var j = 0; j < neighbors.length; j++)
        {
          var neighbor = neighbors[j];
          var neighborLinks = neighbor.getAllLinks();

          //if (neighborLinks.length < minConnections) continue;

          var totalLinks = neighbors.length + neighborLinks.length;

          var cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnections) * (1 - point.distance);
          var minMultipleCutThreshhold = 0.15;
          while (cutThreshhold > 0)
          {
            if (Math.random() < cutThreshhold)
            {
              point.removeLink(neighbor);
              cuts++;

              var path = aStar(point, neighbor);

              if (!path) // left point inaccesible
              {
                point.addLink(neighbor);
                cuts--;
                reverts++;
              }
            }
            else noCuts++;

            cutThreshhold -= minMultipleCutThreshhold;
          }
        }
      }

      console.log(cuts, noCuts, reverts)
    }
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
    makeSectors(minSize: number, maxSize: number)
    {
      var totalStars = this.nonFillerPoints.length;
      var unassignedStars: Star[] = this.nonFillerPoints.slice(0);
      var leftoverStars: Star[] = [];
      
      var averageSize = (minSize + maxSize) / 2;
      var averageSectorsAmount = Math.round(totalStars / averageSize);

      var sectorsById:
      {
        [sectorId: number]: Sector;
      } = {};

      var sameSectorFN = function(a, b)
      {
        return a.sector === b.sector;
      };

      while (averageSectorsAmount > 0 && unassignedStars.length > 0)
      {
        var seedStar = unassignedStars.pop();
        var canFormMinSizeSector = seedStar.getIslandForQualifier(sameSectorFN, minSize).length >= minSize;

        if (canFormMinSizeSector)
        {
          var sector = new Sector();
          sectorsById[sector.id] = sector;

          var discoveryStarIndex = 0;
          sector.addStar(seedStar);

          while (sector.stars.length < minSize)
          {
            var discoveryStar = sector.stars[discoveryStarIndex];

            var frontier = discoveryStar.getLinkedInRange(1).all;
            frontier = frontier.filter(function(star)
            {
              return !star.sector;
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
        var candidateSectors: Sector[] = [];

        for (var j = 0; j < neighbors.length; j++)
        {
          if (!neighbors[j].sector) continue;
          else
          {
            if (!alreadyAddedNeighborSectors[neighbors[j].sector.id])
            {
              alreadyAddedNeighborSectors[neighbors[j].sector.id] = true;
              candidateSectors.push(neighbors[j].sector);
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
            if (!sectorNeighbors[k].sector)
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

    setResources()
    {
      // TODO
      var getResourceDistributionFlags = function(region: Region)
      {
        switch (region.id)
        {
          case "center":
          {
            return ["rare"];
          }
          default:
          {
            return ["common"];
          }
        }
      }

      var getResourcesForDistributionGroups = function(groupsToMatch: string[])
      {
        var allResources = Templates.Resources;
        var matchingResources: Templates.IResourceTemplate[] = [];

        for (var resourceType in allResources)
        {
          var resourceGroups = allResources[resourceType].distributionGroups;
          for (var i = 0; i < resourceGroups.length; i++)
          {
            if (groupsToMatch.indexOf(resourceGroups[i]) !== -1)
            {
              matchingResources.push(allResources[resourceType]);
              break;
            }
          }
        }

        return matchingResources;
      }

      for (var sectorId in this.sectors)
      {
        var sector = this.sectors[sectorId];

        var majorityRegions = sector.getMajorityRegions();

        var resourceDistributionFlags: string[] = [];
        var resourcesAlreadyPresentInRegions:
        {
          [resourceType: string]: boolean;
        } = {};

        for (var i = 0; i < majorityRegions.length; i++)
        {
          resourceDistributionFlags = resourceDistributionFlags.concat(
            getResourceDistributionFlags(majorityRegions[i]));

          for (var j = 0; j < majorityRegions[i].stars.length; j++)
          {
            var star = majorityRegions[i].stars[j];
            if (star.resource)
            {
              resourcesAlreadyPresentInRegions[star.resource.type] = true;
            }
          }
        }


        var candidateResources =
          getResourcesForDistributionGroups(resourceDistributionFlags);

        var nonDuplicateResources = candidateResources.filter(function(resource)
        {
          return !resourcesAlreadyPresentInRegions[resource.type];
        });

        if (nonDuplicateResources.length > 0)
        {
          candidateResources = nonDuplicateResources;
        }

        var selectedResource: Templates.IResourceTemplate = null;

        // TODO
        while (!selectedResource)
        {
          var randomResource = getRandomArrayItem(candidateResources);
          if (Math.random() < randomResource.rarity)
          {
            selectedResource = randomResource;
          }
        }

        var star = getRandomArrayItem(sector.stars);
        star.setResource(selectedResource);
      }
    }
  }
}
