/// <reference path="spiralgalaxygeneration.ts" />
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

        minPlayers: 2,
        maxPlayers: 5,

        mapGenFunction: spiralGalaxyGeneration,

        options:
        {
          defaultOptions:
          {
            height:
            {
              min: 800,
              max: 1600,
              step: 1
            },
            width:
            {
              min: 800,
              max: 1600,
              step: 1
            },
            starCount:
            {
              min: 30,
              max: 50,
              step: 1
            }
          },
          basicOptions:
          {
            arms:
            {
              min: 4,
              max: 6,
              step: 1
            },
            centerDensity:
            {
              min: 1,
              max: 75,
              step: 1,
              defaultValue: 40
            }
          },
          advancedOptions:
          {
            funnyNumber:
            {
              min: 69,
              max: 420,
              step: 351,
              defaultValue: 69
            }
          }
        }
      }
    }
  }
}