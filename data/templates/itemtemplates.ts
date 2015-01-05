/// <reference path="abilitytemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IItemTemplate
    {
      type: string;
      displayName: string;

      techLevel: number;

      slot: string; // low, mid, high

      ability?: AbilityTemplate;
      attributes?:
      {
        attack?: number;
        defence?: number;
        intelligence?: number;
        speed?: number;
      };

    }
    export module Items
    {
      export var testItem =
      {
        type: "testItem",
        displayName: "Test item",
        
        techLevel: 1,

        slot: "high",
        ability: Abilities.bombAttack
      }
      export var testItem1 =
      {
        type: "testItem1",
        displayName: "Test item1",
        
        techLevel: 1,

        slot: "high",
        attributes:
        {
          defence: -1,
          speed: 1
        },
        ability: Abilities.bombAttack
      }
      export var testItem2 =
      {
        type: "testItem2",
        displayName: "Test item2",
        
        techLevel: 1,

        slot: "mid",
        attributes:
        {
          defence: -1,
          speed: 2
        }
      }
      export var testItem3 =
      {
        type: "testItem3",
        displayName: "Test item3",
        
        techLevel: 1,

        slot: "low",
        attributes:
        {
          defence: 3,
          speed: -2
        }
      }
    }
  }
}
