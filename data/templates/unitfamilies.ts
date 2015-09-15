/// <reference path="units.ts" />
/// <reference path="idistributable.d.ts" />

module Rance
{
  export module Templates
  {
    export interface IUnitFamily extends IDistributable
    {
      type: string;
      debugOnly: boolean;
      alwaysAvailable: boolean;

      associatedTemplates?: IUnitTemplate[]; //set dynamically
    }
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
