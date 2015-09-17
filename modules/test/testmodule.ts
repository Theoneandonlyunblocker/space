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
          name: "Commercial Spaceport Test",

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
