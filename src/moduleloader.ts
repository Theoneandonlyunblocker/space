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
    moduleLoadStart:
    {
      [index: string]: number;
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

      this.moduleLoadStart[moduleFile.key] = Date.now();
      moduleFile.loadAssets(this.finishLoadingModuleFile.bind(this, moduleFile, afterLoaded));

      if (moduleFile.ruleSet)
      {
        this.copyRuleSet(moduleFile.ruleSet);
      }
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
      var loadTime = Date.now() - this.moduleLoadStart[moduleFile.key];
      console.log("Module '" + moduleFile.key + "' finished loading in " + loadTime + "ms");
      afterLoaded();
    }
    constructModuleFile(moduleFile: IModuleFile)
    {
      moduleFile.constructModule(this.moduleData);
      this.moduleData.addSubModule(moduleFile);
    }
    copyRuleSet(toCopy: IModuleRuleSet)
    {
      this.moduleData.ruleSet = deepMerge(this.moduleData.ruleSet, toCopy);
    }
  }
}
