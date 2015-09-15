/// <reference path="abilities.ts"/>
/// <reference path="passiveskills.ts" />
/// <reference path="ispritetemplate.d.ts"/>
/// <reference path="unitfamilies.ts" />

module Rance
{
  export module Templates
  {
    export const enum UnitTemplateArchetype
    {
      combat, // overall fighting
      defence, // protecting allies
      utility // useful misc abilities
    }
    
    export interface IUnitTemplate
    {
      type: string;
      displayName: string;
      sprite: ISpriteTemplate;
      isSquadron: boolean;
      buildCost: number;
      icon: string;
      maxHealth: number;
      maxMovePoints: number;

      // archetype is used by the ai to balance unit composition
      archetype: UnitTemplateArchetype;
      // family is used to group ships for local specialties and AI favorites
      // f.ex. sector specializes in producing units with beam weapons
      families : IUnitFamily[];

      // how many stars away unit can see
      // -1: no vision, 0: current star only, 1: current & 1 away etc.
      visionRange: number;
      // like vision but for stealthy ships
      detectionRange: number;
      isStealthy?: boolean;

      attributeLevels:
      {
        attack: number;
        defence: number;
        intelligence: number;
        speed: number;
      };
      abilities: IAbilityTemplate[];
      passiveSkills?: IPassiveSkillTemplate[];
    }
    export module Units
    {
      export var cheatShip: IUnitTemplate =
      {
        type: "cheatShip",
        displayName: "Debug Ship",
        archetype: UnitTemplateArchetype.combat,
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
      export var fighterSquadron: IUnitTemplate =
      {
        type: "fighterSquadron",
        displayName: "Fighter Squadron",
        archetype: UnitTemplateArchetype.combat,
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
      export var bomberSquadron: IUnitTemplate =
      {
        type: "bomberSquadron",
        displayName: "Bomber Squadron",
        archetype: UnitTemplateArchetype.combat,
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
      export var battleCruiser: IUnitTemplate =
      {
        type: "battleCruiser",
        displayName: "Battlecruiser",
        archetype: UnitTemplateArchetype.combat,
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
      export var scout: IUnitTemplate =
      {
        type: "scout",
        displayName: "Scout",
        archetype: UnitTemplateArchetype.utility,
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
      export var stealthShip: IUnitTemplate =
      {
        type: "stealthShip",
        displayName: "Stealth Ship",
        archetype: UnitTemplateArchetype.utility,
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
      export var shieldBoat: IUnitTemplate =
      {
        type: "shieldBoat",
        displayName: "Shield Boat",
        archetype: UnitTemplateArchetype.defence,
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

      export var redShip: IUnitTemplate =
      {
        type: "redShip",
        displayName: "Red ship",
        archetype: UnitTemplateArchetype.utility,
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
      export var blueShip: IUnitTemplate =
      {
        type: "blueShip",
        displayName: "Blue ship",
        archetype: UnitTemplateArchetype.utility,
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
