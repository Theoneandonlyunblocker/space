/// <reference path="../../src/moduledata.ts" />

/// <reference path="templates/units.ts" />
/// <reference path="templates/abilities.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export var moduleFile: IModuleFile =
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
          moduleData.copyAllTemplates(Rance.Modules.DefaultModule.Templates);

          return moduleData;
        }
      }
    }
  }
}
