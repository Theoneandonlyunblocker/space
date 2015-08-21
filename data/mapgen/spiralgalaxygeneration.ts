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
        players: Player[], independents: Player[]): MapGen.MapGenResult
      {
        // generate points
        
        // in closure because tons of temporary variables we dont really care about
        var sg = (function setStarGenerationProps(options: IMapGenOptionValues)
        {
          var totalSize = options.defaultOptions.width * options.defaultOptions.height;
          var totalStars = totalSize * options.defaultOptions.starDensity / 1000;

          var actualArms = options.basicOptions["arms"]
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
        var fillerStars: Star[] = [];
        var regions: MapGen2.Region2[] = [];

        var centerRegion = new MapGen2.Region2("center", false);
        regions.push(centerRegion);

        for (var i = 0; i < sg.totalArms; i++)
        {
          var isFiller = i % 2 !== 0;
          var regionName = isFiller ? "filler_" + i : "arm_" + i;
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
              fillerStars.push(star);
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

        var allStars = stars.concat(fillerStars);

        // make voronoi
        var voronoi = MapGen2.makeVoronoi(allStars, options.defaultOptions.width,
          options.defaultOptions.height);

        // relax voronoi
        MapGen2.relaxVoronoi(voronoi, function(star: Star)
        {
          return star.mapGenData.distance;
        });
        // recalculate after relaxing;
        voronoi = MapGen2.makeVoronoi(allStars, options.defaultOptions.width,
          options.defaultOptions.height);

        // link stars
        MapGen2.linkAllStars(stars);

        // sever links
        for (var i = 0; i < regions.length; i++)
        {
          region.severLinksToFiller();
          region.severLinksToNonCenter();

          for (var j = 0; j < regions[i].stars.length; j++)
          {
            regions[i].stars[j].severLinksToNonAdjacent();
          }
        }

        MapGen2.partiallyCutLinks(stars, 4);

        // make sectors

        // set resources

        // set players

        return new MapGen.MapGenResult(
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
