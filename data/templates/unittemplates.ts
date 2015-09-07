/// <reference path="abilitytemplates.ts"/>
/// <reference path="passiveskilltemplates.ts" />
/// <reference path="spritetemplate.d.ts"/>

module Rance
{
  export module Templates
  {
    export interface IUnitTemplate
    {
      type: string;

      /*
      archetype is used by the ai to balance unit composition
      
      combat: overall fighting
      defence: protetcting allies
      magic: int based damage dealer
      support: boost / heal allies
      utility: useful misc abilities
       */
      archetype: string;
      displayName: string;
      sprite: ISpriteTemplate;
      isSquadron: boolean;
      buildCost: number;
      icon: string;
      maxHealth: number;
      maxMovePoints: number;
      visionRange: number;
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
    export module ShipTypes
    {
      export var cheatShip: IUnitTemplate =
      {
        type: "cheatShip",
        displayName: "Debug Ship",
        archetype: "combat",
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
          PassiveSkills.autoHeal
        ]
      }
      export var fighterSquadron: IUnitTemplate =
      {
        type: "fighterSquadron",
        displayName: "Fighter Squadron",
        archetype: "combat",
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
        archetype: "combat",
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
        archetype: "combat",
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
        archetype: "utility",
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
        archetype: "defence",
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
        ]
      }
    }
  }
}
