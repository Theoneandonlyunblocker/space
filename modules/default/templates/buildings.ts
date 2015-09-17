/// <reference path="../../../src/templateinterfaces/idefencebuildingtemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/ibuildingtemplate.d.ts"/>
module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export module Buildings
        {
          export var sectorCommand: Rance.Templates.IDefenceBuildingTemplate =
          {
            type: "sectorCommand",
            category: "defence",
            family: "sectorCommand",
            displayName: "Sector Command",

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
          export var sectorCommand1: Rance.Templates.IDefenceBuildingTemplate =
          {
            type: "sectorCommand1",
            category: "defence",
            family: "sectorCommand",
            displayName: "Sector Command1",

            iconSrc: "sectorCommand.png",
            buildCost: 100,

            maxPerType: 1,

            maxUpgradeLevel: 1,
            upgradeOnly: true,
            defenderAdvantage: 0.3
          }
          export var sectorCommand2: Rance.Templates.IDefenceBuildingTemplate =
          {
            type: "sectorCommand2",
            category: "defence",
            family: "sectorCommand",
            displayName: "Sector Command2",

            iconSrc: "sectorCommand.png",
            buildCost: 200,

            maxPerType: 1,

            maxUpgradeLevel: 1,
            upgradeOnly: true,
            defenderAdvantage: 0.3
          }
          export var starBase: Rance.Templates.IDefenceBuildingTemplate =
          {
            type: "starBase",
            category: "defence",
            displayName: "Starbase",

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
          export var commercialPort: Rance.Templates.IBuildingTemplate =
          {
            type: "commercialPort",
            category: "economy",
            displayName: "Commercial Spaceport",

            iconSrc: "commercialPort.png",
            buildCost: 200,

            maxPerType: 1,

            maxUpgradeLevel: 4
          }
          export var deepSpaceRadar: Rance.Templates.IBuildingTemplate =
          {
            type: "deepSpaceRadar",
            category: "vision",
            displayName: "Deep Space Radar",

            iconSrc: "commercialPort.png",
            buildCost: 200,

            maxPerType: 1,

            maxUpgradeLevel: 2
          }
          export var itemManufactory: Rance.Templates.IBuildingTemplate =
          {
            type: "itemManufactory",
            category: "manufactory",
            displayName: "Item Manufactory",

            iconSrc: "commercialPort.png",
            buildCost: 200,

            maxPerType: 1,

            maxUpgradeLevel: 3 // MANUFACTORY_MAX
          }
          export var resourceMine: Rance.Templates.IBuildingTemplate =
          {
            type: "resourceMine",
            category: "mine",
            displayName: "Mine",

            iconSrc: "commercialPort.png",
            buildCost: 500,

            maxPerType: 1,

            maxUpgradeLevel: 3
          }
        }
      }
    }
  }
}
