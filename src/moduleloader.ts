/// <reference path="moduledata.ts" />

module Rance
{
  export class ModuleLoader
  {
    moduleData: ModuleData;
    moduleFiles:
    {
      [index: string]: IModuleFile;
    } = {};
    hasLoaded:
    {
      [index: string]: boolean;
    } = {};

    constructor()
    {
      this.moduleData = new ModuleData();
    }

    addModuleFile(moduleFile: IModuleFile)
    {
      if (this.moduleFiles[moduleFile.key])
      {
        throw new Error("Duplicate module key " + moduleFile.key);
        return;
      }

      this.moduleFiles[moduleFile.key] = moduleFile;
      this.hasLoaded[moduleFile.key] = false;
    }
    loadModuleFile(moduleFile: IModuleFile, afterLoaded: () => void)
    {
      if (!this.moduleFiles[moduleFile.key])
      {
        this.addModuleFile(moduleFile);
      }

      moduleFile.loadAssets(this.finishLoadingModuleFile.bind(this, moduleFile, afterLoaded));
    }
    loadAll(afterLoaded: () => void)
    {
      var boundCheckAll = function()
      {
        if (this.hasFinishedLoading())
        {
          afterLoaded();
        }
      }.bind(this);

      for (var index in this.moduleFiles)
      {
        this.loadModuleFile(this.moduleFiles[index], boundCheckAll);
      }
    }
    hasFinishedLoading(): boolean
    {
      for (var index in this.hasLoaded)
      {
        if (!this.hasLoaded[index])
        {
          return false;
        }
      }

      return true;
    }
    finishLoadingModuleFile(moduleFile: IModuleFile, afterLoaded: () => void)
    {
      this.hasLoaded[moduleFile.key] = true;
      this.constructModuleFile(moduleFile);
      afterLoaded();
    }
    constructModuleFile(moduleFile: IModuleFile)
    {
      moduleFile.constructModule(this.moduleData);
      this.moduleData.addSubModule(moduleFile);
    }
  }
}
