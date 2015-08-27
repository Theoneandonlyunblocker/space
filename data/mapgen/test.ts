/// <reference path="spiralgalaxygeneration.ts" />
/// <reference path="mapgentemplate.ts" />

module Rance
{
  export module Templates
  {
    export module MapGen
    {
      export var tinierSpiralGalaxy: IMapGenTemplate =
      {
        key: "tinierSpiralGalaxy",
        displayName: "Tinier Spiral galaxy",
        description: "Create a spiral galaxy with arms but tinier (just for testing)",

        minPlayers: 2,
        maxPlayers: 5,

        mapGenFunction: spiralGalaxyGeneration,

        options:
        {
          defaultOptions:
          {
            height:
            {
              min: 500,
              max: 1000,
              step: 1
            },
            width:
            {
              min: 500,
              max: 1000,
              step: 1
            },
            starCount:
            {
              min: 15,
              max: 35,
              step: 1
            }
          },
          basicOptions:
          {
            arms:
            {
              min: 2,
              max: 5,
              step: 1,
              defaultValue: 4
            },
            starSizeRegularity:
            {
              min: 1,
              max: 100,
              step: 1,
              defaultValue: 100
            },
            centerDensity:
            {
              min: 1,
              max: 90,
              step: 1,
              defaultValue: 50
            }
          }
        }
      }
    }
  }
}