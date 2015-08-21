/// <reference path="../../src/utility.ts" />

/// <reference path="../../src/point.ts" />
/// <reference path="../../src/player.ts" />
/// <reference path="../../src/star.ts" />
/// <reference path="../../src/mapgen/region2.ts" />
/// <reference path="../../src/mapgen/mapgenutils.ts" />
/// <reference path="../../src/mapgen/mapgenresult.ts" />
/// <reference path="mapgenoptions.ts" />

module Rance
{
  export module Templates
  {
    export module MapGen
    {
      export function spiralGalaxyGeneration(options: IMapGenOptionValues,
        players: Player[], independents: Player[]): MapGen2.MapGenResult
      {
        // generate points
        
        // in closure because tons of temporary variables we dont really care about
        var sg = (function setStarGenerationProps(options: IMapGenOptionValues)
        {
          var totalSize = options.defaultOptions.width * options.defaultOptions.height;
          var totalStars = options.defaultOptions.starCount;
          
          var actualArms = options.basicOptions["arms"];
          var totalArms = actualArms * 2 // includes filler arms

          var percentageInCenter = 0.3;
          var percentageInArms = 1 - percentageInCenter;
          var amountPerArm = totalStars / actualArms * percentageInArms;
          var amountInCenter = totalStars * percentageInCenter;


          return(
          {
            totalStars: totalStars,
            totalArms: totalArms,

            amountPerArm: Math.round(amountPerArm),
            amountPerFillerArm: Math.round(amountPerArm / 2),
            amountPerCenter: Math.round(amountInCenter / totalArms),
            centerSize: 0.4,
            
            armDistance: Math.PI * 2 / totalArms, // distance between arms
            armOffsetMax: 0.5, // how far stars are allowed to move from arm center
            armRotationFactor: actualArms / 3, // how twisty the arms are. bigger number = twistier
            galaxyRotation: randRange(0, Math.PI * 2) // rotation of entire galaxy
          });
        })(options);

        function makeStar(distanceMin: number, distanceMax: number, arm: number, maxOffset: number): Star
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

          var star = new Star(x, y);

          star.mapGenData.distance = distance;

          return star;
        }

        var stars: Star[] = [];
        var fillerPoints: Point[] = [];
        var regions: MapGen2.Region2[] = [];

        var centerRegion = new MapGen2.Region2("center", false);
        regions.push(centerRegion);

        var fillerRegionId = 0;
        var regionId = 0;

        for (var i = 0; i < sg.totalArms; i++)
        {
          var isFiller = i % 2 !== 0;
          var regionName = isFiller ? "filler_" + fillerRegionId++ : "arm_" + regionId++;
          var region = new MapGen2.Region2(regionName, isFiller);
          regions.push(region);

          var amountForThisArm = isFiller ? sg.amountPerFillerArm : sg.amountPerArm;
          var maxOffsetForThisArm = isFiller ? sg.armOffsetMax / 2 : sg.armOffsetMax;

          for (var j = 0; j < amountForThisArm; j++)
          {
            var star = makeStar(sg.centerSize, 1, i, maxOffsetForThisArm);

            region.addStar(star);

            if (isFiller)
            {
              fillerPoints.push(star);
            }
            else
            {
              stars.push(star);
            }
          }

          for (var j = 0; j < sg.amountPerCenter; j++)
          {
            var star = makeStar(0, sg.centerSize, i, maxOffsetForThisArm);
            
            centerRegion.addStar(star);
            stars.push(star);
          }
        }

        var allPoints: Point[] = fillerPoints.concat(stars);

        // make voronoi
        var voronoi = MapGen2.makeVoronoi(allPoints, options.defaultOptions.width,
          options.defaultOptions.height);

        // relax voronoi
        for (var i = 0; i < 2; i++)
        {
          MapGen2.relaxVoronoi(voronoi, function(star: Star)
          {
            return 0.25 + 0.75 * star.mapGenData.distance;
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

        MapGen2.partiallyCutLinks(stars, 4);

        // make sectors
        //MapGen2.makeSectors(stars, 3, 5);

        // set resources

        // set players
        var startRegions: MapGen2.Region2[] = (function setStartingRegions()
        {
          var armCount = options.basicOptions["arms"];
          var playerCount = players.length;

          var playerArmStep = armCount / playerCount;

          var startRegions: MapGen2.Region2[] = [];
          var candidateRegions = regions.filter(function(region: MapGen2.Region2)
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

        var startPositions: Star[] = (function getStartPoints(regions: MapGen2.Region2[])
        {
          var startPositions: Star[] = [];

          for (var i = 0; i < regions.length; i++)
          {
            var region = regions[i];

            var starsByDistance = region.stars.slice(0).sort(function(a: Star, b: Star)
            {
              return b.mapGenData.distance - a.mapGenData.distance;
            });

            startPositions.push(starsByDistance[0]);
          }

          return startPositions
        })(startRegions);

        for (var i = 0; i < players.length; i++)
        {
          var star = startPositions[i];
          var player = players[i];

          player.addStar(star);
        }

        MapGen2.setupPirates(stars, independents[0], 1);

        return new MapGen2.MapGenResult(
        {
          stars: stars,
          fillerPoints: fillerPoints,
          width: options.defaultOptions.width,
          height: options.defaultOptions.height
        });
      }
    }
  }
}
