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
      buildCost: number;

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
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 4
      }
      export var starBase: IBuildingTemplate =
      {
        type: "starBase",
        category: "defence",
        name: "Starbase",

        icon: "img\/buildings\/starBase.png",
        buildCost: 200,

        maxPerType: 3,

        maxUpgradeLevel: 1
      }
      export var commercialPort: IBuildingTemplate =
      {
        type: "commercialPort",
        category: "economy",
        name: "Commercial Spaceport",

        icon: "img\/buildings\/commercialPort.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 4
      }
      export var deepSpaceRadar: IBuildingTemplate =
      {
        type: "deepSpaceRadar",
        category: "vision",
        name: "Deep Space Radar",

        icon: "img\/buildings\/commercialPort.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 2
      }
    }
  }
}
