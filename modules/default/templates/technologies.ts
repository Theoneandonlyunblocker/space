/// <reference path="../../../src/templateinterfaces/itechnologytemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/idistributable.d.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace Technologies
        {
          export var stealth: Rance.TechnologyTemplate =
          {
            key: "stealth",
            displayName: "Stealth",
            description: "stealthy stuff",
            maxLevel: 9
          }
          export var lasers: Rance.TechnologyTemplate =
          {
            key: "lasers",
            displayName: "Lasers",
            description: "pew pew",
            maxLevel: 9
          }
          export var missiles: Rance.TechnologyTemplate =
          {
            key: "missiles",
            displayName: "Missiles",
            description: "boom",
            maxLevel: 9
          }
          export var test1: Rance.TechnologyTemplate =
          {
            key: "test1",
            displayName: "test1",
            description: "test1",
            maxLevel: 1
          }
          export var test2: Rance.TechnologyTemplate =
          {
            key: "test2",
            displayName: "test2",
            description: "test2",
            maxLevel: 2
          }
        }
      }
    }
  }
}
