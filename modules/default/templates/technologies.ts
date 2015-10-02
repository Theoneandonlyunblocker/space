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
        }
      }
    }
  }
}
