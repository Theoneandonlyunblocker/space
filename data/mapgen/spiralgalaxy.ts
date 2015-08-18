// /// <reference path="spiralgalaxygeneration.ts" />
/// <reference path="mapgentemplate.ts" />

module Rance
{
  export module Templates
  {
    export module MapGen
    {
      export var spiralGalaxy: IMapGenTemplate =
      {
        key: "spiralGalaxy",
        displayName: "Test Map",
        description: "(not implemented yet) just testing",

        //mapGenFunction: spiralGalaxyGeneration,

        options:
        {
          defaultOptions:
          {
            height:
            {
              min: 400,
              max: 800,
              step: 1
            },
            width:
            {
              min: 400,
              max: 800,
              step: 1
            },
            starDensity:
            {
              min: 0.1,
              max: 0.12,
              step: 0.001
            },
            playerAmount:
            {
              min: 2,
              max: 5,
              step: 1
            }
          },
          basicOptions:
          {
            arms:
            {
              min: 3,
              max: 5,
              step: 1
            }
          },
          advancedOptions:
          {
            funnyNumber:
            {
              min: 69,
              max: 420,
              step: 351
            }
          }
        }
      }
    }
  }
}