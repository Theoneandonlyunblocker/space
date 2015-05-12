/// <reference path="abilitytemplates.ts" />

module Rance
{
  export module Templates
  {
    export interface IItemTemplate
    {
      type: string;
      displayName: string;
      description?: string;
      icon: string;

      techLevel: number;

      slot: string; // low, mid, high

      cost: number;

      ability?: IAbilityTemplate;
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

        icon: "img\/items\/cannon.png",
        
        techLevel: 1,
        cost: 100,

        slot: "high",
        ability: Abilities.bombAttack
      }
      export var bombLauncher2 =
      {
        type: "bombLauncher2",
        displayName: "Bomb Launcher 2",

        icon: "img\/items\/cannon.png",
        
        techLevel: 2,
        cost: 200,

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

        icon: "img\/items\/cannon.png",
        
        techLevel: 3,
        cost: 300,

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

        icon: "img\/items\/blueThing.png",
        
        techLevel: 1,
        cost: 100,

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

        icon: "img\/items\/blueThing.png",
        
        techLevel: 2,
        cost: 200,

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

        icon: "img\/items\/blueThing.png",
        
        techLevel: 3,
        cost: 300,

        attributes:
        {
          maxActionPoints: 1,
          speed: 3
        },

        slot: "mid"
      }
      export var shieldPlating1 =
      {
        type: "shieldPlating1",
        displayName: "Shield Plating 1",

        icon: "img\/items\/armor1.png",
        
        techLevel: 1,
        cost: 100,

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

        icon: "img\/items\/armor1.png",
        
        techLevel: 2,
        cost: 200,

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

        icon: "img\/items\/armor1.png",
        
        techLevel: 3,
        cost: 300,

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
