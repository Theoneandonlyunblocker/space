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
      export var sectorCommand: IBuildingTemplate =
      {
        type: "sectorCommand",
        category: "defence",
        name: "Sector Command",

        icon: "img\/buildings\/sectorCommand.png",

        maxPerType: 1,

        maxUpgradeLevel: 4
      }
      export var starBase: IBuildingTemplate =
      {
        type: "starBase",
        category: "defence",
        name: "Starbase",

        icon: "img\/buildings\/starBase.png",

        maxPerType: 3,

        maxUpgradeLevel: 1
      }
    }
  }
}
