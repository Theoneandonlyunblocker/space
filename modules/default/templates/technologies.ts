/// <reference path="../../../src/templateinterfaces/itechnologytemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/idistributable.d.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module Technologies
        {
          export var stealth: Rance.Templates.ITechnologyTemplate =
          {
            key: "stealth",
            displayName: "Stealth",
            description: "stealthy stuff",
            maxLevel: 9
          }
          export var lasers: Rance.Templates.ITechnologyTemplate =
          {
            key: "lasers",
            displayName: "Lasers",
            description: "pew pew",
            maxLevel: 9
          }
          export var missiles: Rance.Templates.ITechnologyTemplate =
          {
            key: "missiles",
            displayName: "Missiles",
            description: "boom",
            maxLevel: 9
          }
          export var test1: Rance.Templates.ITechnologyTemplate =
          {
            key: "test1",
            displayName: "test1",
            description: "test1",
            maxLevel: 9
          }
          export var test2: Rance.Templates.ITechnologyTemplate =
          {
            key: "test2",
            displayName: "test2",
            description: "test2",
            maxLevel: 9
          }
        }
      }
    }
  }
}
