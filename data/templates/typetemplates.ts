/// <reference path="abilitytemplates.ts"/>


module Rance
{
  export module Templates
  {
    export interface TypeTemplate
    {
      type: string;
      typeName: string;
      isSquadron: boolean;
      buildCost: number;
      icon: string;
      maxStrength: number;
      maxMovePoints: number;
      attributeLevels:
      {
        attack: number;
        defence: number;
        intelligence: number;
        speed: number;
      };
      abilities: AbilityTemplate[];
    }
    export module ShipTypes
    {
      export var fighterSquadron: TypeTemplate =
      {
        type: "fighterSquadron",
        typeName: "Fighter Squadron",
        isSquadron: true,
        buildCost: 100,
        icon: "img\/icons\/f.png",
        maxStrength: 0.7,
        maxMovePoints: 2,
        attributeLevels:
        {
          attack: 0.8,
          defence: 0.6,
          intelligence: 0.4,
          speed: 1
        },
        abilities:
        [
          Abilities.closeAttack,
          Abilities.standBy
        ]
      }
      export var bomberSquadron: TypeTemplate =
      {
        type: "bomberSquadron",
        typeName: "Bomber Squadron",
        isSquadron: true,
        buildCost: 200,
        icon: "img\/icons\/f.png",
        maxStrength: 0.5,
        maxMovePoints: 1,
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
      export var battleCruiser: TypeTemplate =
      {
        type: "battleCruiser",
        typeName: "Battlecruiser",
        isSquadron: false,
        buildCost: 200,
        icon: "img\/icons\/b.png",
        maxStrength: 1,
        maxMovePoints: 1,
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
      export var scout: TypeTemplate =
      {
        type: "scout",
        typeName: "Scout",
        isSquadron: true,
        buildCost: 200,
        icon: "img\/icons\/f.png",
        maxStrength: 0.6,
        maxMovePoints: 2,
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
      export var shieldBoat: TypeTemplate =
      {
        type: "shieldBoat",
        typeName: "Shield Boat",
        isSquadron: false,
        buildCost: 200,
        icon: "img\/icons\/b.png",
        maxStrength: 0.9,
        maxMovePoints: 1,
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
