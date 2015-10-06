/// <reference path="../../../src/templateinterfaces/iitemtemplate.d.ts"/>
/// <reference path="abilities.ts" />
/// <reference path="passiveskills.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module Items
        {
          export var bombLauncher1: Rance.Templates.IItemTemplate =
          {
            type: "bombLauncher1",
            displayName: "Bomb Launcher 1",
            description: "",
            icon: "img\/items\/cannon.png",
            
            techLevel: 1,
            buildCost: 100,

            slot: "high",
            ability: Abilities.bombAttack
          }
          export var bombLauncher2: Rance.Templates.IItemTemplate =
          {
            type: "bombLauncher2",
            displayName: "Bomb Launcher 2",
            description: "",
            icon: "img\/items\/cannon.png",
            
            techLevel: 2,
            buildCost: 200,

            attributes:
            {
              attack: 1
            },

            slot: "high",
            ability: Abilities.bombAttack
          }
          export var bombLauncher3: Rance.Templates.IItemTemplate =
          {
            type: "bombLauncher3",
            displayName: "Bomb Launcher 3",
            description: "",
            icon: "img\/items\/cannon.png",
            
            techLevel: 3,
            buildCost: 300,

            attributes:
            {
              attack: 3
            },

            slot: "high",
            ability: Abilities.bombAttack
          }

          export var afterBurner1: Rance.Templates.IItemTemplate =
          {
            type: "afterBurner1",
            displayName: "Afterburner 1",
            description: "",
            icon: "img\/items\/blueThing.png",
            
            techLevel: 1,
            buildCost: 100,

            attributes:
            {
              speed: 1
            },

            slot: "mid",
            passiveSkill: PassiveSkills.overdrive
          }
          export var afterBurner2: Rance.Templates.IItemTemplate =
          {
            type: "afterBurner2",
            displayName: "Afterburner 2",
            description: "",
            icon: "img\/items\/blueThing.png",
            
            techLevel: 2,
            buildCost: 200,

            attributes:
            {
              speed: 2
            },

            slot: "mid"
          }
          export var afterBurner3: Rance.Templates.IItemTemplate =
          {
            type: "afterBurner3",
            displayName: "Afterburner 3",
            description: "",
            icon: "img\/items\/blueThing.png",
            
            techLevel: 3,
            buildCost: 300,

            attributes:
            {
              maxActionPoints: 1,
              speed: 3
            },

            slot: "mid"
          }
          export var shieldPlating1: Rance.Templates.IItemTemplate =
          {
            type: "shieldPlating1",
            displayName: "Shield Plating 1",
            description: "",
            icon: "img\/items\/armor1.png",
            
            techLevel: 1,
            buildCost: 100,

            attributes:
            {
              defence: 1
            },

            slot: "low"
          }
          export var shieldPlating2: Rance.Templates.IItemTemplate =
          {
            type: "shieldPlating2",
            displayName: "Shield Plating 2",
            description: "",
            icon: "img\/items\/armor1.png",
            
            techLevel: 2,
            buildCost: 200,

            attributes:
            {
              defence: 2
            },

            slot: "low"
          }
          export var shieldPlating3: Rance.Templates.IItemTemplate =
          {
            type: "shieldPlating3",
            displayName: "Shield Plating 3",
            description: "",
            icon: "img\/items\/armor1.png",
            
            techLevel: 3,
            buildCost: 300,

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
  }
}
