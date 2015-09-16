/// <reference path="../../src/templateinterfaces/idefencebuildingtemplate.d.ts"/>
/// <reference path="../../src/templateinterfaces/ibuildingtemplate.d.ts"/>
module Rance
{
  export module Templates
  {
    export module Buildings
    {
      export var sectorCommand: IDefenceBuildingTemplate =
      {
        type: "sectorCommand",
        category: "defence",
        family: "sectorCommand",
        name: "Sector Command",

        iconSrc: "sectorCommand.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 1,

        upgradeInto:
        [
          {
            templateType: "sectorCommand1",
            level: 1
          },
          {
            templateType: "sectorCommand2",
            level: 1
          }
        ],
        defenderAdvantage: 0.2
      }
      export var sectorCommand1: IDefenceBuildingTemplate =
      {
        type: "sectorCommand1",
        category: "defence",
        family: "sectorCommand",
        name: "Sector Command1",

        iconSrc: "sectorCommand.png",
        buildCost: 100,

        maxPerType: 1,

        maxUpgradeLevel: 1,
        upgradeOnly: true,
        defenderAdvantage: 0.3
      }
      export var sectorCommand2: IDefenceBuildingTemplate =
      {
        type: "sectorCommand2",
        category: "defence",
        family: "sectorCommand",
        name: "Sector Command2",

        iconSrc: "sectorCommand.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 1,
        upgradeOnly: true,
        defenderAdvantage: 0.3
      }
      export var starBase: IDefenceBuildingTemplate =
      {
        type: "starBase",
        category: "defence",
        name: "Starbase",

        iconSrc: "starBase.png",
        buildCost: 200,

        maxPerType: 3,

        maxUpgradeLevel: 1,
        defenderAdvantage: 0.1,
        upgradeInto:
        [
          {
            templateType: "sectorCommand",
            level: 1
          }
        ]
      }
      export var commercialPort: IBuildingTemplate =
      {
        type: "commercialPort",
        category: "economy",
        name: "Commercial Spaceport",

        iconSrc: "commercialPort.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 4
      }
      export var deepSpaceRadar: IBuildingTemplate =
      {
        type: "deepSpaceRadar",
        category: "vision",
        name: "Deep Space Radar",

        iconSrc: "commercialPort.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 2
      }
      export var itemManufactory: IBuildingTemplate =
      {
        type: "itemManufactory",
        category: "manufactory",
        name: "Item Manufactory",

        iconSrc: "commercialPort.png",
        buildCost: 200,

        maxPerType: 1,

        maxUpgradeLevel: 3 // MANUFACTORY_MAX
      }
      export var resourceMine: IBuildingTemplate =
      {
        type: "resourceMine",
        category: "mine",
        name: "Mine",

        iconSrc: "commercialPort.png",
        buildCost: 500,

        maxPerType: 1,

        maxUpgradeLevel: 3
      }
    }
  }
}
