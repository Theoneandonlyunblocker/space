/// <reference path="../../../src/templateinterfaces/iunittemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/ispritetemplate.d.ts"/>

/// <reference path="../../../data/templates/abilities.ts"/>
/// <reference path="../../../data/templates/passiveskills.ts" />
/// <reference path="../../../data/templates/unitfamilies.ts" />
/// <reference path="../../../data/templates/unitarchetypes.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module Units
        {
          export var cheatShip: Rance.Templates.IUnitTemplate =
          {
            type: "cheatShip",
            displayName: "Debug Ship",
            archetype: UnitArchetypes.combat,
            families: [UnitFamilies.debug],
            sprite:
            {
              imageSrc: "cheatShip.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: false,
            buildCost: 0,
            icon: "img\/icons\/f.png",
            maxHealth: 1,
            maxMovePoints: 999,
            visionRange: 1,
            detectionRange: -1,
            attributeLevels:
            {
              attack: 9,
              defence: 9,
              intelligence: 9,
              speed: 9
            },
            abilities:
            [
              Abilities.debugAbility,
              Abilities.rangedAttack,
              Abilities.bombAttack,
              Abilities.boardingHook,
              Abilities.guardColumn,
              Abilities.ranceAttack,
              Abilities.standBy
            ],
            passiveSkills:
            [
              PassiveSkills.autoHeal,
              PassiveSkills.warpJammer,
              PassiveSkills.medic
            ]
          }
          export var fighterSquadron: Rance.Templates.IUnitTemplate =
          {
            type: "fighterSquadron",
            displayName: "Fighter Squadron",
            archetype: UnitArchetypes.combat,
            families: [UnitFamilies.basic],
            sprite:
            {
              imageSrc: "fighter.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 100,
            icon: "img\/icons\/fa.png",
            maxHealth: 0.7,
            maxMovePoints: 2,
            visionRange: 1,
            detectionRange: -1,
            attributeLevels:
            {
              attack: 0.8,
              defence: 0.6,
              intelligence: 0.4,
              speed: 1
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.closeAttack,
              Abilities.standBy
            ]
          }
          export var bomberSquadron: Rance.Templates.IUnitTemplate =
          {
            type: "bomberSquadron",
            displayName: "Bomber Squadron",
            archetype: UnitArchetypes.combat,
            families: [UnitFamilies.basic],
            sprite:
            {
              imageSrc: "bomber.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 200,
            icon: "img\/icons\/fb.png",
            maxHealth: 0.5,
            maxMovePoints: 1,
            visionRange: 1,
            detectionRange: -1,
            attributeLevels:
            {
              attack: 0.7,
              defence: 0.4,
              intelligence: 0.5,
              speed: 0.8
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.bombAttack,
              Abilities.standBy
            ]
          }
          export var battleCruiser: Rance.Templates.IUnitTemplate =
          {
            type: "battleCruiser",
            displayName: "Battlecruiser",
            archetype: UnitArchetypes.combat,
            families: [UnitFamilies.basic],
            sprite:
            {
              imageSrc: "battleCruiser.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 200,
            icon: "img\/icons\/bc.png",
            maxHealth: 1,
            maxMovePoints: 1,
            visionRange: 1,
            detectionRange: -1,
            attributeLevels:
            {
              attack: 0.8,
              defence: 0.8,
              intelligence: 0.7,
              speed: 0.6
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.wholeRowAttack,
              Abilities.standBy
            ]
          }
          export var scout: Rance.Templates.IUnitTemplate =
          {
            type: "scout",
            displayName: "Scout",
            archetype: UnitArchetypes.utility,
            families: [UnitFamilies.basic],
            sprite:
            {
              imageSrc: "scout.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 200,
            icon: "img\/icons\/sc.png",
            maxHealth: 0.6,
            maxMovePoints: 2,
            visionRange: 2,
            detectionRange: 0,
            attributeLevels:
            {
              attack: 0.5,
              defence: 0.5,
              intelligence: 0.8,
              speed: 0.7
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.standBy
            ]
          }
          export var stealthShip: Rance.Templates.IUnitTemplate =
          {
            type: "stealthShip",
            displayName: "Stealth Ship",
            archetype: UnitArchetypes.utility,
            families: [UnitFamilies.debug],
            sprite:
            {
              imageSrc: "scout.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 500,
            icon: "img\/icons\/sc.png",
            maxHealth: 0.6,
            maxMovePoints: 1,
            visionRange: 1,
            detectionRange: -1,
            isStealthy: true,
            attributeLevels:
            {
              attack: 0.5,
              defence: 0.5,
              intelligence: 0.8,
              speed: 0.7
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.standBy
            ]
          }
          export var shieldBoat: Rance.Templates.IUnitTemplate =
          {
            type: "shieldBoat",
            displayName: "Shield Boat",
            archetype: UnitArchetypes.defence,
            families: [UnitFamilies.basic],
            sprite:
            {
              imageSrc: "shieldBoat.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 200,
            icon: "img\/icons\/sh.png",
            maxHealth: 0.9,
            maxMovePoints: 1,
            visionRange: 1,
            detectionRange: -1,
            attributeLevels:
            {
              attack: 0.5,
              defence: 0.9,
              intelligence: 0.6,
              speed: 0.4
            },
            abilities:
            [
              Abilities.guardColumn,
              Abilities.rangedAttack,
              Abilities.standBy
            ],
            passiveSkills:
            [
              PassiveSkills.initialGuard
            ]
          }

          export var redShip: Rance.Templates.IUnitTemplate =
          {
            type: "redShip",
            displayName: "Red ship",
            archetype: UnitArchetypes.utility,
            families: [UnitFamilies.red],
            sprite:
            {
              imageSrc: "scout.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 200,
            icon: "img\/icons\/sc.png",
            maxHealth: 0.6,
            maxMovePoints: 2,
            visionRange: 2,
            detectionRange: 0,
            attributeLevels:
            {
              attack: 0.5,
              defence: 0.5,
              intelligence: 0.8,
              speed: 0.7
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.standBy
            ]
          }
          export var blueShip: Rance.Templates.IUnitTemplate =
          {
            type: "blueShip",
            displayName: "Blue ship",
            archetype: UnitArchetypes.utility,
            families: [UnitFamilies.blue],
            sprite:
            {
              imageSrc: "scout.png",
              anchor: {x: 0.5, y: 0.5}
            },
            isSquadron: true,
            buildCost: 200,
            icon: "img\/icons\/sc.png",
            maxHealth: 0.6,
            maxMovePoints: 2,
            visionRange: 2,
            detectionRange: 0,
            attributeLevels:
            {
              attack: 0.5,
              defence: 0.5,
              intelligence: 0.8,
              speed: 0.7
            },
            abilities:
            [
              Abilities.rangedAttack,
              Abilities.standBy
            ]
          }
        }
      }
    }
  }
}
