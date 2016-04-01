/// <reference path="spiralgalaxygeneration.ts" />
/// <reference path="../../../src/templateinterfaces/imapgentemplate.d.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace MapGen
        {
          export var spiralGalaxy: Rance.MapGenTemplate =
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
                  displayName: "Height",
                  range:
                  {
                    min: 800,
                    max: 1600,
                    step: 1
                  }
                },
                width:
                {
                  displayName: "Width",
                  range:
                  {
                    min: 800,
                    max: 1600,
                    step: 1
                  }
                },
                starCount:
                {
                  displayName: "Star count",
                  range:
                  {
                    min: 20,
                    max: 40,
                    step: 1
                  }
                }
              },
              basicOptions:
              {
                arms:
                {
                  displayName: "Arms",
                  range:
                  {
                    min: 3,
                    max: 6,
                    step: 1,
                    defaultValue: 5
                  }
                },
                starSizeRegularity:
                {
                  displayName: "Star size regularity",
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
                  displayName: "Center density",
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