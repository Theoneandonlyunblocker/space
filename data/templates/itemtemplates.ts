/// <reference path="abilitytemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IItemTemplate
    {
      type: string;
      displayName: string;

      slot: string; // low, mid, high
      abilities: AbilityTemplate[];
    }
    export module Items
    {
      export var testItem =
      {
        type: "testItem",
        displayName: "Test item",
        
        slot: "high",
        abilities: [Abilities.bombAttack]
      }
    }
  }
}
