module Rance
{
  export module Templates
  {
    export interface IBuildingTemplate
    {
      type: string;
      category: string;
      name: string;

      icon: string;

      maxPerType: number;

      maxUpgradeLevel: number;

      upgradeInto?:
      {
        type: string;
        level: number;
      }[];

      onBuild?: () => void;
      onTurnEnd?: () => void;
    }
    export module Buildings
    {
      export var fort: IBuildingTemplate =
      {
        type: "fort",
        category: "defence",
        name: "Fort",

        icon: "img\/buildings\/fort.png",

        maxPerType: 1,

        maxUpgradeLevel: 4
      }
      export var base: IBuildingTemplate =
      {
        type: "base",
        category: "defence",
        name: "Base",

        icon: "img\/buildings\/base.png",

        maxPerType: 3,

        maxUpgradeLevel: 1
      }
    }
  }
}
