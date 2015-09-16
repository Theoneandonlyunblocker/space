/// <reference path="../../src/moduledata.ts" />

module Rance
{
  export module Modules
  {
    export var defaultModule: IModuleFile =
    {
      metaData:
      {
        name: "default",
        version: "6.9",
        author: "me",
        description: "default module"
      },
      constructModule: function(moduleData: ModuleData)
      {
        moduleData.copyAllTemplates(Rance.Templates);

        return moduleData;
      }
    }
  }
}
