/// <reference path="../../src/templateinterfaces/iunitfamily.d.ts"/>
/// <reference path="../../src/templateinterfaces/idistributable.d.ts" />

module Rance
{
  export module Templates
  {
    export module UnitFamilies
    {
      export var debug: IUnitFamily =
      {
        type: "debug",
        debugOnly: true,
        alwaysAvailable: true,
        rarity: 0,
        distributionGroups: []
      }
      export var basic: IUnitFamily =
      {
        type: "basic",
        debugOnly: false,
        alwaysAvailable: true,
        rarity: 0,
        distributionGroups: []
      }
      export var red: IUnitFamily =
      {
        type: "red",
        debugOnly: false,
        alwaysAvailable: false,
        rarity: 1,
        distributionGroups: ["common", "rare"]
      }
      export var blue: IUnitFamily =
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
