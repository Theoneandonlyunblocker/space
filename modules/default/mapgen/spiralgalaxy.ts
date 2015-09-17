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
          export var spiralGalaxy: Rance.Templates.IMapGenTemplate =
          {
            key: "spiralGalaxy",
            displayName: "Spiral galaxy",
            description: "Create a spiral galaxy with arms",

            minPlayers: 2,
            maxPlayers: 5,

            mapGenFunction: DefaultModule.MapGenFunctions.spiralGalaxyGeneration,

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
  }
}