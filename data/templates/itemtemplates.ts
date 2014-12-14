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
      export var testItem2 =
      {
        type: "testItem2",
        displayName: "Test item2",
        
        slot: "mid",
        abilities: [Abilities.bombAttack]
      }
      export var testItem3 =
      {
        type: "testItem3",
        displayName: "Test item3",
        
        slot: "low",
        abilities: [Abilities.bombAttack]
      }
    }
  }
}
