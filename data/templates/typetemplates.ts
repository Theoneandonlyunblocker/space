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
        attributeLevels:
        {
          attack: 0.8,
          defence: 0.6,
          intelligence: 0.4,
          speed: 1
        },
        abilities:
        [
          Abilities.testAbility,
          Abilities.standBy
        ]
      }
      export var battleCruiser: TypeTemplate =
      {
        typeName: "Battlecruiser",
        isSquadron: false,
        icon: "img\/icons\/b.png",
        maxStrength: 1,
        attributeLevels:
        {
          attack: 0.8,
          defence: 0.8,
          intelligence: 0.7,
          speed: 0.6
        },
        abilities:
        [
          Abilities.testAbility,
          Abilities.standBy
        ]
      }
    }
  }
}
