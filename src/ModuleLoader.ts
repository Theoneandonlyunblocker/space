import ModuleData from "./ModuleData.ts";
import ModuleFile from "./ModuleFile.d.ts";
import RuleSet from "./RuleSet.ts";
import
{
  deepMerge
} from "./utility.ts";

export default class ModuleLoader
{
  moduleData: ModuleData;
  moduleFiles:
  {
    [index: string]: ModuleFile;
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

  addModuleFile(moduleFile: ModuleFile)
  {
    if (this.moduleFiles[moduleFile.key])
    {
      throw new Error("Duplicate module key " + moduleFile.key);
    }

    this.moduleFiles[moduleFile.key] = moduleFile;
    this.hasLoaded[moduleFile.key] = false;
  }
  loadModuleFile(moduleFile: ModuleFile, afterLoaded: () => void)
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
  finishLoadingModuleFile(moduleFile: ModuleFile, afterLoaded: () => void)
  {
    this.hasLoaded[moduleFile.key] = true;
    this.constructModuleFile(moduleFile);
    var loadTime = Date.now() - this.moduleLoadStart[moduleFile.key];
    console.log("Module '" + moduleFile.key + "' finished loading in " + loadTime + "ms");
    afterLoaded();
  }
  constructModuleFile(moduleFile: ModuleFile)
  {
    moduleFile.constructModule(this.moduleData);
    this.moduleData.addSubModule(moduleFile);
  }
  copyRuleSet(toCopy: RuleSet)
  {
    this.moduleData.ruleSet = deepMerge(this.moduleData.ruleSet, toCopy);
  }
}
