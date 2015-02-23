/// <reference path="abilitytemplates.ts"/>
/// <reference path="spritetemplate.d.ts"/>

module Rance
{
  export module Templates
  {
    export interface IUnitTemplate
    {
      type: string;
      typeName: string;
      sprite: ISpriteTemplate;
      isSquadron: boolean;
      buildCost: number;
      icon: string;
      maxStrength: number;
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
    }
    export module ShipTypes
    {
      export var cheatShip: IUnitTemplate =
      {
        type: "cheatShip",
        typeName: "Cheat Ship",
        sprite:
        {
          imageSrc: "testShip.png",
          anchor: {x: 0.5, y: 0.5}
        },
        isSquadron: false,
        buildCost: 0,
        icon: "img\/icons\/f.png",
        maxStrength: 0.5,
        maxMovePoints: 999,
        visionRange: 999,
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
          Abilities.guardColumn
        ]
      }
      export var fighterSquadron: IUnitTemplate =
      {
        type: "fighterSquadron",
        typeName: "Fighter Squadron",
        sprite:
        {
          imageSrc: "testShip.png",
          anchor: {x: 0.5, y: 0.5}
        },
        isSquadron: true,
        buildCost: 100,
        icon: "img\/icons\/f.png",
        maxStrength: 0.7,
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
          Abilities.closeAttack
        ]
      }
      export var bomberSquadron: IUnitTemplate =
      {
        type: "bomberSquadron",
        typeName: "Bomber Squadron",
        sprite:
        {
          imageSrc: "testShip2.png",
          anchor: {x: 0.5, y: 0.5}
        },
        isSquadron: true,
        buildCost: 200,
        icon: "img\/icons\/f.png",
        maxStrength: 0.5,
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
          Abilities.bombAttack
        ]
      }
      export var battleCruiser: IUnitTemplate =
      {
        type: "battleCruiser",
        typeName: "Battlecruiser",
        sprite:
        {
          imageSrc: "testShip2.png",
          anchor: {x: 0.5, y: 0.5}
        },
        isSquadron: false,
        buildCost: 200,
        icon: "img\/icons\/b.png",
        maxStrength: 1,
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
          Abilities.wholeRowAttack
        ]
      }
      export var scout: IUnitTemplate =
      {
        type: "scout",
        typeName: "Scout",
        sprite:
        {
          imageSrc: "testShip3.png",
          anchor: {x: 0.5, y: 0.5}
        },
        isSquadron: true,
        buildCost: 200,
        icon: "img\/icons\/f.png",
        maxStrength: 0.6,
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
          Abilities.rangedAttack
        ]
      }
      export var shieldBoat: IUnitTemplate =
      {
        type: "shieldBoat",
        typeName: "Shield Boat",
        sprite:
        {
          imageSrc: "testShip3.png",
          anchor: {x: 0.5, y: 0.5}
        },
        isSquadron: false,
        buildCost: 200,
        icon: "img\/icons\/b.png",
        maxStrength: 0.9,
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
          Abilities.rangedAttack
        ]
      }
    }
  }
}
