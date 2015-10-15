/// <reference path="spiralgalaxygeneration.ts" />
/// <reference path="../../../src/templateinterfaces/imapgentemplate.d.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module MapGen
        {
          export var tinierSpiralGalaxy: Rance.Templates.IMapGenTemplate =
          {
            key: "tinierSpiralGalaxy",
            displayName: "Tinier Spiral galaxy",
            description: "Create a spiral galaxy with arms but tinier (just for testing)",

            minPlayers: 2,
            maxPlayers: 4,

            mapGenFunction: DefaultModule.MapGenFunctions.spiralGalaxyGeneration,

            options:
            {
              defaultOptions:
              {
                height:
                {
                  displayName: "height",
                  range:
                  {
                    min: 500,
                    max: 1000,
                    step: 1
                  }
                },
                width:
                {
                  displayName: "width",
                  range:
                  {
                    min: 500,
                    max: 1000,
                    step: 1
                  }
                },
                starCount:
                {
                  displayName: "starCount",
                  range:
                  {
                    min: 15,
                    max: 30,
                    step: 1,
                    defaultValue: 20
                  }
                }
              },
              basicOptions:
              {
                arms:
                {
                  displayName: "arms",
                  range:
                  {
                    min: 2,
                    max: 5,
                    step: 1,
                    defaultValue: 4
                  }
                },
                starSizeRegularity:
                {
                  displayName: "starSizeRegularity",
                  range:
                  {
                    min: 1,
                    max: 100,
                    step: 1,
                    defaultValue: 100
                  }
                },
                centerDensity:
                {
                  displayName: "centerDensity",
                  range:
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
    }
  }
}