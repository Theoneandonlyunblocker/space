/// <reference path="abilitytemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IItemTemplate
    {
      slot: string; // low, mid, high
      abilities: AbilityTemplate[];
    }
    export module Items
    {
      export var testItem =
      {
        slot: "high",
        abilities: [Abilities.bombAttack]
      }
    }
  }
}
