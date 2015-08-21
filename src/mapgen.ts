/// <reference path="../lib/voronoi.d.ts" />
/// <reference path="../lib/quadtree.d.ts" />

/// <reference path="../data/mapgen/builtinmaps.ts" />

/// <reference path="mapgen/triangulation.ts" />
/// <reference path="mapgen/triangle.ts" />
/// <reference path="mapgen/region2.ts" />
/// <reference path="mapgen/sector2.ts" />
/// <reference path="star.ts" />
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
      [id: string]: MapGen2.Region2;
    } = {};
    sectors:
    {
      [id: number]: MapGen2.Sector2;
    };
    triangles: MapGen2.Triangle[] = [];

    voronoiDiagram: any;
    voronoiTreeMap: any;

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

      this.severUnWantedLinks();
      this.partiallyCutConnections(4);

      var isConnected = this.isConnected();
      if (!isConnected)
      {
        return this.makeMap(options);
      }

      this.makeTreeMap();

      this.sectors = this.makeSectors(3, 5);
      this.setResources();

      this.setPlayers();
      this.setDistanceFromStartLocations();

      this.setupPirates();

      this.clearMapGenData();

      return this;
    }
    makeMapGenResult()
    {
      return new MapGen2.MapGenResult(
      {
        width: this.maxWidth * 2,
        height: this.maxHeight * 2,
        stars: this.getNonFillerPoints(),
        fillerPoints: this.getFillerPoints()
      });
    }
    clearMapGenData()
    {
      if (Options.debugMode)
      {
        console.warn("Skipped cleaning map gen data due to debug mode being enabled");
        return;
      }
      for (var i = 0; i < this.points.length; i++)
      {
        this.points[i].mapGenData = null;
        delete this.points[i].mapGenData;
        delete this.points[i].voronoiId;
      }
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


          if (!isFinite(star.mapGenData.distanceFromNearestStartLocation))
          {
            star.mapGenData.distanceFromNearestStartLocation = distance;
          }
          else
          {
            star.mapGenData.distanceFromNearestStartLocation =
              Math.min(distance, star.mapGenData.distanceFromNearestStartLocation)
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
          var distance = star.mapGenData.distanceFromNearestStartLocation;

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
      this.regions[name] = new MapGen2.Region2(name, isFiller);
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


      var makePoint = function makePointFN(distanceMin, distanceMax, region, armOffsetMax, isFiller)
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
        point.mapGenData = {};

        point.mapGenData.distance = distance;
        region.addStar(point);
        point.baseIncome = randInt(2, 10) * 10;
        point.isFiller = isFiller;

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
          var point = makePoint(centerThreshhold, 1, region, maxOffsetForThisArm, currentArmIsFiller);

          points.push(point);
        }

        for (var j = 0; j < amountForThisCenter; j++)
        {
          var point = makePoint(0, centerThreshhold, centerRegion, armOffsetMax, false);
          points.push(point);
        }

        currentArmIsFiller = !currentArmIsFiller;
      }

      return points;
    }
    triangulate()
    {
      if (!this.points || this.points.length < 3) throw new Error();
      this.triangles = MapGen2.triangulate(this.points);

      this.makeLinks();
    }
    makeLinks()
    {
      if (!this.triangles || this.triangles.length < 1) throw new Error();

      for (var i = 0; i < this.triangles.length; i++)
      {
        var edges = <Star[][]> this.triangles[i].getEdges();
        for (var j = 0; j < edges.length; j++)
        {
          edges[j][0].addLink(edges[j][1]);
        }
      }
    }
    severUnWantedLinks()
    {
      for (var i = 0; i < this.points.length; i++)
      {
        var star = this.points[i];
        star.severLinksToFiller();
        star.severLinksToNonAdjacent();

        if (star.mapGenData.distance > 0.7)
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
        cell.id = cell.site.voronoiId;
        cell.vertices = this.getVerticesFromCell(cell);
      }
    }
    makeTreeMap()
    {
      var treeMap = new QuadTree(
      {
        x: 0,
        y: 0,
        width: this.maxWidth * 2,
        height: this.maxHeight * 2
      });

      var points = this.getNonFillerPoints();

      for (var i = 0; i < points.length; i++)
      {
        var cell = points[i].voronoiCell;
        var bbox = cell.getBbox();
        bbox.cell = cell;
        treeMap.insert(bbox);
      }

      this.voronoiTreeMap = treeMap;
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
        var centroid = MapGen2.getCentroid(vertices);
        var timesToDampen = point.mapGenData.distance * dampeningFactor;

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
    getFillerPoints()
    {
      if (!this.points) return [];

      var fillerPoints = this.points.filter(function(point)
      {
        return !point.isFiller;
      });

      return fillerPoints;
    }
    getNonFillerPoints()
    {
      if (!this.points) return [];
      if (!this.nonFillerPoints || this.nonFillerPoints.length <= 0)
      {
        this.nonFillerPoints = this.points.filter(function(point)
        {
          return !point.isFiller;
        });
      }

      return this.nonFillerPoints;
    }
    getFurthestPointInRegion(region: MapGen2.Region2): Star
    {
      var furthestDistance = 0;
      var furthestStar: Star = null;

      for (var i = 0; i < region.stars.length; i++)
      {
        if (region.stars[i].mapGenData.distance > furthestDistance)
        {
          furthestStar = region.stars[i];
          furthestDistance = region.stars[i].mapGenData.distance;
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

          var cutThreshhold = 0.05 + 0.025 * (totalLinks - minConnections) * (1 - point.mapGenData.distance);
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
        [sectorId: number]: MapGen2.Sector2;
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
          var sector = new MapGen2.Sector2(sectorIdGen++);
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
        var candidateSectors: MapGen2.Sector2[] = [];

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

    setResources()
    {
      // TODO
      var getResourceDistributionFlags = function(region: MapGen2.Region2)
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
        sector.resourceType = selectedResource;
        sector.resourceLocation = star;
      }
    }
  }
}
