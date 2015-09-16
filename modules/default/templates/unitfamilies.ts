/// <reference path="../../../src/templateinterfaces/iunitfamily.d.ts"/>
/// <reference path="../../../src/templateinterfaces/idistributable.d.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module UnitFamilies
        {
          export var debug: Rance.Templates.IUnitFamily =
          {
            type: "debug",
            debugOnly: true,
            alwaysAvailable: true,
            rarity: 0,
            distributionGroups: []
          }
          export var basic: Rance.Templates.IUnitFamily =
          {
            type: "basic",
            debugOnly: false,
            alwaysAvailable: true,
            rarity: 0,
            distributionGroups: []
          }
          export var red: Rance.Templates.IUnitFamily =
          {
            type: "red",
            debugOnly: false,
            alwaysAvailable: false,
            rarity: 1,
            distributionGroups: ["common", "rare"]
          }
          export var blue: Rance.Templates.IUnitFamily =
          {
            type: "blue",
            debugOnly: false,
            alwaysAvailable: false,
            rarity: 1,
            distributionGroups: ["common", "rare"]
          }
        }
      }
    }
  }
}
