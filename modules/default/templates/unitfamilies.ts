/// <reference path="../../../src/templateinterfaces/iunitfamily.d.ts"/>
/// <reference path="../../../src/templateinterfaces/idistributable.d.ts" />

export namespace DefaultModule
{
  export namespace Templates
  {
    export namespace UnitFamilies
    {
      export var debug: UnitFamily =
      {
        type: "debug",
        debugOnly: true,
        alwaysAvailable: true,
        rarity: 0,
        distributionGroups: []
      }
      export var basic: UnitFamily =
      {
        type: "basic",
        debugOnly: false,
        alwaysAvailable: true,
        rarity: 0,
        distributionGroups: []
      }
      export var red: UnitFamily =
      {
        type: "red",
        debugOnly: false,
        alwaysAvailable: false,
        rarity: 1,
        distributionGroups: ["common", "rare"]
      }
      export var blue: UnitFamily =
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
