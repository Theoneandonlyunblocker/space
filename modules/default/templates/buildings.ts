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
            description: "Defence building with slight defender advantage. (All defence buildings must " +
              "be captured to gain control of area)",

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
            description: "just testing upgrade paths",

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
            description: "just testing upgrade paths",

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
            description: "Defence building with no defender advantage. (All defence buildings must " +
              "be captured to gain control of area)",

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
            description: "Increase star income by 20",

            iconSrc: "commercialPort.png",
            buildCost: 200,

            maxPerType: 1,
            effect:
            {
              income:
              {
                flat: 20
              }
            },

            maxUpgradeLevel: 4
          }
          export var deepSpaceRadar: Rance.Templates.IBuildingTemplate =
          {
            type: "deepSpaceRadar",
            category: "vision",
            displayName: "Deep Space Radar",
            description: "Increase star vision and detection radius",

            iconSrc: "commercialPort.png",
            buildCost: 200,

            maxPerType: 1,
            effect:
            {
              vision: 1,
              detection: 0.999
            },

            maxUpgradeLevel: 2
          }
          export var itemManufactory: Rance.Templates.IBuildingTemplate =
          {
            type: "itemManufactory",
            category: "manufactory",
            displayName: "Item Manufactory",
            description: "todo",

            iconSrc: "commercialPort.png",
            buildCost: 200,

            maxPerType: 1,
            effect:
            {
              itemLevel: 1
            },

            maxUpgradeLevel: 3 // MANUFACTORY_MAX
          }
          export var resourceMine: Rance.Templates.IBuildingTemplate =
          {
            type: "resourceMine",
            category: "mine",
            displayName: "Mine",
            description: "Gathers resources from current star",

            iconSrc: "commercialPort.png",
            buildCost: 500,

            maxPerType: 1,
            effect:
            {
              resourceIncome:
              {
                flat: 1
              }
            },

            maxUpgradeLevel: 3
          }
          export var reserachLab: Rance.Templates.IBuildingTemplate =
          {
            type: "reserachLab",
            category: "research",
            displayName: "Research Lab",
            description: "Increase research speed",

            iconSrc: "commercialPort.png",
            buildCost: 300,

            maxPerType: 1,
            effect:
            {
              research:
              {
                flat: 10
              }
            },

            maxUpgradeLevel: 3
          }
        }
      }
    }
  }
}
