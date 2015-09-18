/// <reference path="../../src/moduledata.ts" />

module Rance
{
  export module Modules
  {
    export module TestModule
    {
      export module BuildingTemplates
      {
        export var commercialPortTest: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
        export var commercialPortTest2: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest2",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
        export var commercialPortTest3: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest3",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
        export var commercialPortTest4: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest4",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
        export var commercialPortTest5: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest5",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
        export var commercialPortTest6: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest6",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
        export var commercialPortTest7: Rance.Templates.IBuildingTemplate =
        {
          type: "commercialPortTest7",
          category: "economy",
          displayName: "Commercial Spaceport Test",

          iconSrc: "commercialPort.png",
          buildCost: 0,

          maxPerType: 1,

          maxUpgradeLevel: 10
        }
      }
      export var moduleFile: IModuleFile =
      {
        key: "test",
        metaData:
        {
          name: "test",
          version: "0.0.420",
          author: "not me",
          description: "just testing"
        },
        loadAssets: function(onLoaded: () => void)
        {
          onLoaded();
        },
        constructModule: function(moduleData: ModuleData)
        {
          moduleData.copyTemplates(TestModule.BuildingTemplates, "Buildings");

          return moduleData;
        }
      }
    }
  }
}
