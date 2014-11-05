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
      attributes:
      {
        attack: number;
        defence: number;
        intelligence: number;
        speed: number;
      }
    }
    export module ShipTypes
    {
      export var fighterSquadron: TypeTemplate =
      {
        typeName: "Fighter Squadron",
        isSquadron: true,
        icon: "img\/sprites\/f.png",
        maxStrength: 0.7,
        attributes:
        {
          attack: 0.8,
          defence: 0.6,
          intelligence: 0.4,
          speed: 1
        }
      }
      export var battleCruiser: TypeTemplate =
      {
        typeName: "Battlecruiser",
        isSquadron: false,
        icon: "img\/sprites\/b.png",
        maxStrength: 1,
        attributes:
        {
          attack: 0.8,
          defence: 0.8,
          intelligence: 0.7,
          speed: 0.6
        }
      }
    }
  }
}
