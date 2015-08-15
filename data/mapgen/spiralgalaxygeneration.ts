/// <reference path="mapgenoptions.ts" />

module Rance
{
  export module Templates
  {
    export module MapGen
    {
      export function spiralGalaxyGeneration(options: IMapGenOptionValues): Star[]
      {
        // generate points
        
        // in closure because tons of temporary variables we dont really care about
        var starGenerationProps = (function setStarGenerationProps(options: IMapGenOptionValues)
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
            amountPerArm: Math.round(amountPerArm),
            amountInCenter: Math.round(amountInCenter),
            centerSize: 0.4,

            totalArms: totalArms,
            amountPerFillerArm: Math.round(amountPerArm / 2),
            
            armDistance: Math.PI * 2 / totalArms, // distance between arms
            armOffsetMax: 0.5, // how far stars are allowed to move from arm center
            armRotationFactor: actualArms / 3, // how twisty the arms are. bigger number = twistier
            galaxyRotation: randRange(0, Math.PI * 2) // rotation of entire galaxy
          });
        })(options);

        console.log(starGenerationProps);

        // make voronoi
        // relax voronoi
      }
    }
  }
}
