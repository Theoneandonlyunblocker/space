/// <reference path="../../../src/templateinterfaces/iitemtemplate.d.ts"/>
/// <reference path="abilities.ts" />
/// <reference path="passiveskills.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace Items
        {
          export var bombLauncher1: Rance.ItemTemplate =
          {
            type: "bombLauncher1",
            displayName: "Bomb Launcher 1",
            description: "",
            icon: "modules\/default\/img\/items\/cannon.png",
            
            techLevel: 1,
            buildCost: 100,

            slot: "high",
            ability: Abilities.bombAttack
          }
          export var bombLauncher2: Rance.ItemTemplate =
          {
            type: "bombLauncher2",
            displayName: "Bomb Launcher 2",
            description: "",
            icon: "modules\/default\/img\/items\/cannon.png",
            
            techLevel: 2,
            buildCost: 200,

            attributes:
            {
              attack: 1
            },

            slot: "high",
            ability: Abilities.bombAttack
          }
          export var bombLauncher3: Rance.ItemTemplate =
          {
            type: "bombLauncher3",
            displayName: "Bomb Launcher 3",
            description: "",
            icon: "modules\/default\/img\/items\/cannon.png",
            
            techLevel: 3,
            buildCost: 300,

            attributes:
            {
              attack: 3
            },

            slot: "high",
            ability: Abilities.bombAttack
          }

          export var afterBurner1: Rance.ItemTemplate =
          {
            type: "afterBurner1",
            displayName: "Afterburner 1",
            description: "",
            icon: "modules\/default\/img\/items\/blueThing.png",
            
            techLevel: 1,
            buildCost: 100,

            attributes:
            {
              speed: 1
            },

            slot: "mid",
            passiveSkill: PassiveSkills.overdrive
          }
          export var afterBurner2: Rance.ItemTemplate =
          {
            type: "afterBurner2",
            displayName: "Afterburner 2",
            description: "",
            icon: "modules\/default\/img\/items\/blueThing.png",
            
            techLevel: 2,
            buildCost: 200,

            attributes:
            {
              speed: 2
            },

            slot: "mid"
          }
          export var afterBurner3: Rance.ItemTemplate =
          {
            type: "afterBurner3",
            displayName: "Afterburner 3",
            description: "",
            icon: "modules\/default\/img\/items\/blueThing.png",
            
            techLevel: 3,
            buildCost: 300,

            attributes:
            {
              maxActionPoints: 1,
              speed: 3
            },

            slot: "mid"
          }
          export var shieldPlating1: Rance.ItemTemplate =
          {
            type: "shieldPlating1",
            displayName: "Shield Plating 1",
            description: "",
            icon: "modules\/default\/img\/items\/armor1.png",
            
            techLevel: 1,
            buildCost: 100,

            attributes:
            {
              defence: 1
            },

            slot: "low"
          }
          export var shieldPlating2: Rance.ItemTemplate =
          {
            type: "shieldPlating2",
            displayName: "Shield Plating 2",
            description: "",
            icon: "modules\/default\/img\/items\/armor1.png",
            
            techLevel: 2,
            buildCost: 200,

            attributes:
            {
              defence: 2
            },

            slot: "low"
          }
          export var shieldPlating3: Rance.ItemTemplate =
          {
            type: "shieldPlating3",
            displayName: "Shield Plating 3",
            description: "",
            icon: "modules\/default\/img\/items\/armor1.png",
            
            techLevel: 3,
            buildCost: 300,

            attributes:
            {
              defence: 3,
              speed: -1
            },

            slot: "low",
            ability: Abilities.guardRow
          }
        }
      }
    }
  }
}
