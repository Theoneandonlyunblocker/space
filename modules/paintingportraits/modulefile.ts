/// <reference path="../../src/moduledata.ts" />
/// <reference path="culture.ts" />

module Rance
{
  export module Modules
  {
    export module PaintingPortraits
    {
      export var moduleFile: IModuleFile =
      {
        key: "paintingPortraits",
        metaData:
        {
          name: "paintingPortraits",
          version: "0.0.420",
          author: "various artists",
          description: "old ppl"
        },
        loadAssets: function(onLoaded: () => void)
        {
          onLoaded();
        },
        constructModule: function(moduleData: ModuleData)
        {
          moduleData.copyTemplates(PaintingPortraits.Culture, "Cultures");

          return moduleData;
        }
      }
    }
  }
}
