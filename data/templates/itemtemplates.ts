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
      export var bombLauncher1 =
      {
        type: "bombLauncher1",
        displayName: "Bomb Launcher 1",
        
        techLevel: 1,

        slot: "high",
        ability: Abilities.bombAttack
      }
      export var bombLauncher2 =
      {
        type: "bombLauncher2",
        displayName: "Bomb Launcher 2",
        
        techLevel: 2,

        attributes:
        {
          attack: 1
        },

        slot: "high",
        ability: Abilities.bombAttack
      }
      export var bombLauncher3 =
      {
        type: "bombLauncher3",
        displayName: "Bomb Launcher 3",
        
        techLevel: 3,

        attributes:
        {
          attack: 3
        },

        slot: "high",
        ability: Abilities.bombAttack
      }

      export var afterBurner1 =
      {
        type: "afterBurner1",
        displayName: "Afterburner 1",
        
        techLevel: 1,

        attributes:
        {
          speed: 1
        },

        slot: "mid"
      }
      export var afterBurner2 =
      {
        type: "afterBurner2",
        displayName: "Afterburner 2",
        
        techLevel: 2,

        attributes:
        {
          speed: 2
        },

        slot: "mid"
      }
      export var afterBurner3 =
      {
        type: "afterBurner3",
        displayName: "Afterburner 3",
        
        techLevel: 3,

        attributes:
        {
          speed: 3
        },

        slot: "mid"
      }
      export var shieldPlating1 =
      {
        type: "shieldPlating1",
        displayName: "Shield Plating 1",
        
        techLevel: 1,

        attributes:
        {
          defence: 1
        },

        slot: "low"
      }
      export var shieldPlating2 =
      {
        type: "shieldPlating2",
        displayName: "Shield Plating 2",
        
        techLevel: 2,

        attributes:
        {
          defence: 2
        },

        slot: "low"
      }
      export var shieldPlating3 =
      {
        type: "shieldPlating3",
        displayName: "Shield Plating 3",
        
        techLevel: 3,

        attributes:
        {
          defence: 3,
          speed: -1
        },

        slot: "low",
        ability: Abilities.guardColumn
      }
    }
  }
}
