/// <reference path="abilitytemplates.ts"/>


module Rance
{
  export module Templates
  {
    export interface TypeTemplate
    {
      typeName: string;
      isSquadron: boolean;
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
        typeName: "Fighter Squadron",
        isSquadron: true,
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
        typeName: "Bomber Squadron",
        isSquadron: true,
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
        typeName: "Battlecruiser",
        isSquadron: false,
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
    }
  }
}
