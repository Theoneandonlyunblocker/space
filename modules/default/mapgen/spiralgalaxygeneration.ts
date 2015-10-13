/// <reference path="../../../src/utility.ts" />
/// <reference path="../../../src/point.ts" />
/// <reference path="../../../src/player.ts" />
/// <reference path="../../../src/star.ts" />
/// <reference path="../../../src/mapgen2/region.ts" />
/// <reference path="../../../src/mapgen2/mapgenutils.ts" />
/// <reference path="../../../src/mapgen2/mapgenresult.ts" />

/// <reference path="../../../src/templateinterfaces/iunitfamily.d.ts" />
/// <reference path="../../../src/templateinterfaces/iresourcetemplate.d.ts" />
/// <reference path="../../../src/templateinterfaces/mapgenoptions.d.ts" />


module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module MapGenFunctions
      {
        export function spiralGalaxyGeneration(options: Rance.Templates.IMapGenOptionValues,
          players: Player[]): MapGen2.MapGenResult
        {
          // generate points
          
          // in closure because tons of temporary variables we dont really care about
          var sg = (function setStarGenerationProps(options: Rance.Templates.IMapGenOptionValues)
          {
            var totalSize = options.defaultOptions.width * options.defaultOptions.height;
            var totalStars = options.defaultOptions.starCount;
            
            var actualArms = options.basicOptions["arms"];
            var totalArms = actualArms * 2 // includes filler arms

            var percentageInCenter = 0.3;
            var percentageInArms = 1 - percentageInCenter;
            var amountInCenter = totalStars * percentageInCenter;
            var amountPerArm = Math.round(totalStars / actualArms * percentageInArms);
            var amountPerFillerArm = Math.round(amountPerArm / 2);
            var amountPerCenter = Math.round(amountInCenter / totalArms);

            // to prevent rounding issues, probably a better way to do this
            var actualStarsInArms = actualArms * amountPerArm;
            var actualStarsInCenter = totalArms * amountPerCenter;
            var actualStars = actualStarsInCenter + actualStarsInArms;
            var starsDeficit = totalStars - actualStars;

            var armsToMakeUpDeficit: number[] = [];
            var starsToAddPerDeficitArm = 0;

            if (starsDeficit !== 0)
            {
              starsToAddPerDeficitArm = starsDeficit > 0 ? 1 : -1;
              var deficitStep = totalArms / Math.abs(starsDeficit);

              for (var i = 0; i < totalArms; i += deficitStep)
              {
                armsToMakeUpDeficit.push(Math.round(i));
              }
            }

            return(
            {
              totalArms: totalArms,
              armsToMakeUpDeficit: armsToMakeUpDeficit,
              starsToAddPerDeficitArm: starsToAddPerDeficitArm,

              amountPerArm: amountPerArm,
              amountPerFillerArm: amountPerFillerArm,
              amountPerCenter: amountPerCenter,
              centerSize: 0.4,
              
              armDistance: Math.PI * 2 / totalArms, // distance between arms
              armOffsetMax: 0.5, // how far stars are allowed to move from arm center
              armRotationFactor: actualArms / 3, // how twisty the arms are. bigger number = twistier
              galaxyRotation: randRange(0, Math.PI * 2) // rotation of entire galaxy
            });
          })(options);

          function makePoint(distanceMin: number, distanceMax: number, arm: number, maxOffset: number)
          {
            var distance = randRange(distanceMin, distanceMax);
            var offset = Math.random() * maxOffset - maxOffset / 2;
            offset *= (1 / distance);

            if (offset < 0) offset = Math.pow(offset, 2) * -1;
            else offset = Math.pow(offset, 2);

            var armRotation = distance * sg.armRotationFactor;
            var angle = arm * sg.armDistance + sg.galaxyRotation + offset + armRotation;

            var width = options.defaultOptions.width / 2;
            var height = options.defaultOptions.height / 2;

            var x = Math.cos(angle) * distance * width + width;
            var y = Math.sin(angle) * distance * height + height;

            return(
            {
              pos:
              {
                x: x,
                y: y
              },
              distance: distance
            });
          }

          function makeStar(point: Point, distance: number)
          {
            var star = new Star(point.x, point.y);
            star.mapGenData.distance = distance;
            star.baseIncome = randInt(4, 10) * 10;

            return star;
          }

          var stars: Star[] = [];
          var fillerPoints: FillerPoint[] = [];
          var regions: MapGen2.Region[] = [];

          var centerRegion = new MapGen2.Region("center", false);
          regions.push(centerRegion);

          var fillerRegionId = 0;
          var regionId = 0;

          for (var i = 0; i < sg.totalArms; i++)
          {
            var isFiller = i % 2 !== 0;
            var regionName = isFiller ? "filler_" + fillerRegionId++ : "arm_" + regionId++;
            var region = new MapGen2.Region(regionName, isFiller);
            regions.push(region);

            var amountForThisArm = isFiller ? sg.amountPerFillerArm : sg.amountPerArm;
            var amountForThisCenter = sg.amountPerCenter;
            if (sg.armsToMakeUpDeficit.indexOf(i) !== -1)
            {
              amountForThisCenter += sg.starsToAddPerDeficitArm;
            }

            var maxOffsetForThisArm = isFiller ? sg.armOffsetMax / 2 : sg.armOffsetMax;

            for (var j = 0; j < amountForThisArm; j++)
            {
              var point = makePoint(sg.centerSize, 1, i, maxOffsetForThisArm);

              if (isFiller)
              {
                var fillerPoint = new FillerPoint(point.pos.x, point.pos.y);
                region.addFillerPoint(fillerPoint);
                fillerPoint.mapGenData.distance = point.distance;

                fillerPoints.push(fillerPoint);
              }
              else
              {
                var star = makeStar(point.pos, point.distance);
                region.addStar(star);

                stars.push(star);
              }
            }

            for (var j = 0; j < amountForThisCenter; j++)
            {
              var point = makePoint(0, sg.centerSize, i, maxOffsetForThisArm);
              var star = makeStar(point.pos, point.distance);
              
              centerRegion.addStar(star);
              stars.push(star);
            }
          }

          var allPoints: Point[] = fillerPoints.concat(stars);

          // make voronoi
          var voronoi = MapGen2.makeVoronoi(allPoints, options.defaultOptions.width,
            options.defaultOptions.height);

          // relax voronoi
          var regularity = options.basicOptions["starSizeRegularity"] / 100;
          var centerDensity = options.basicOptions["centerDensity"] / 100;
          var inverseCenterDensity = 1 - centerDensity;
          for (var i = 0; i < 2; i++)
          {
            MapGen2.relaxVoronoi(voronoi, function(star: Star)
            {
              return (inverseCenterDensity + centerDensity * star.mapGenData.distance) * regularity;
            });

            voronoi = MapGen2.makeVoronoi(allPoints, options.defaultOptions.width,
              options.defaultOptions.height);
          }

          // link stars
          MapGen2.linkAllStars(stars);

          // sever links
          for (var i = 0; i < regions.length; i++)
          {
            regions[i].severLinksByQualifier(function(a, b)
            {
              return(
                a.mapGenData.region !== b.mapGenData.region &&
                a.mapGenData.region !== regions[0] &&
                b.mapGenData.region !== regions[0]
              );
            });

            for (var j = 0; j < regions[i].stars.length; j++)
            {
              regions[i].stars[j].severLinksToNonAdjacent();
            }
          }

          var isConnected = stars[0].getLinkedInRange(9999).all.length === stars.length;
          if (!isConnected)
          {
            console.log("Regenerated map due to insufficient connections");
            return spiralGalaxyGeneration(options, players);
          }

          MapGen2.partiallyCutLinks(stars, 4, 2);

          // make sectors
          var sectorsById = MapGen2.makeSectors(stars, 3, 3);

          // set resources && local ships
          var allSectors: MapGen2.Sector[] = [];
          for (var sectorId in sectorsById)
          {
            allSectors.push(sectorsById[sectorId]);
          }

          var resourcePlacerFN = function(sector: MapGen2.Sector, resource: Rance.Templates.IResourceTemplate)
          {
            sector.addResource(resource);
          }
          MapGen2.distributeDistributablesPerSector(
            allSectors, "resources", app.moduleData.Templates.Resources, resourcePlacerFN);

          var localShipPlacerFN = function(sector: MapGen2.Sector, shipFamily: Rance.Templates.IUnitFamily)
          {
            for (var i = 0; i < sector.stars.length; i++)
            {
              var star = sector.stars[i];
              star.buildableUnitTypes = star.buildableUnitTypes.concat(shipFamily.associatedTemplates);
            }
          }
          MapGen2.distributeDistributablesPerSector(
            allSectors, "unitFamilies", app.moduleData.Templates.UnitFamilies, localShipPlacerFN);

          // set players
          var startRegions: MapGen2.Region[] = (function setStartingRegions()
          {
            var armCount = options.basicOptions["arms"];
            var playerCount = Math.min(players.length, armCount);

            var playerArmStep = armCount / playerCount;

            var startRegions: MapGen2.Region[] = [];
            var candidateRegions = regions.filter(function(region: MapGen2.Region)
            {
              return region.id.indexOf("arm") !== -1;
            });

            for (var i = 0; i < playerCount; i++)
            {
              var regionNumber = Math.floor(i * playerArmStep);
              var regionToAdd = candidateRegions[regionNumber];

              startRegions.push(regionToAdd);
            }

            return startRegions;
          })();

          var startPositions: Star[] = (function getStartPoints(regions: MapGen2.Region[])
          {
            var startPositions: Star[] = [];

            for (var i = 0; i < regions.length; i++)
            {
              var region = regions[i];

              var starsByDistance = region.stars.slice(0).sort(function(a: Star, b: Star)
              {
                return b.mapGenData.distance - a.mapGenData.distance;
              });

              var star = starsByDistance[0];
              startPositions.push(star);
            }

            return startPositions
          })(startRegions);

          for (var i = 0; i < startPositions.length; i++)
          {
            var star = startPositions[i];
            var player = players[i];

            player.addStar(star);

            MapGen2.addDefenceBuildings(star, 2);
            star.buildManufactory();
          }

          var pirates = new Player(true);
          pirates.setupPirates();

          for (var i = 0; i < allSectors.length; i++)
          {
            var sector = allSectors[i];
            sector.setupIndependents(pirates, 1, 0);
          }


          return new MapGen2.MapGenResult(
          {
            stars: stars,
            fillerPoints: fillerPoints,
            width: options.defaultOptions.width,
            height: options.defaultOptions.height,
            seed: "" + Math.random(), // TODO
            independents: [pirates]
          });
        }
      }
    }
  }
}
