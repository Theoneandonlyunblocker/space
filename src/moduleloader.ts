/// <reference path="moduledata.ts" />

module Rance
{
  export class ModuleLoader
  {
    moduleData: ModuleData;

    constructor()
    {
      this.moduleData = new ModuleData();
    }

    loadModuleFile(moduleFile: IModuleFile)
    {
      moduleFile.constructModule(this.moduleData);
      this.moduleData.addSubModule(moduleFile);
    }
  }
}
