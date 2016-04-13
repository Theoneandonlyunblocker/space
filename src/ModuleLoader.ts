import ModuleData from "./ModuleData";
import ModuleFile from "./ModuleFile";
import RuleSet from "./RuleSet";
import
{
  deepMerge
} from "./utility";

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

    if (moduleFile.ruleSet)
    {
      this.copyRuleSet(moduleFile.ruleSet);
    }
    
    this.moduleLoadStart[moduleFile.key] = Date.now();
    if (moduleFile.loadAssets)
    {
      moduleFile.loadAssets(this.finishLoadingModuleFile.bind(this, moduleFile, afterLoaded));
    }
    else
    {
      this.finishLoadingModuleFile(moduleFile, afterLoaded);
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
    if (moduleFile.constructModule)
    {
      moduleFile.constructModule(this.moduleData);
    }
    
    this.moduleData.addSubModule(moduleFile);
  }
  copyRuleSet(toCopy: RuleSet)
  {
    this.moduleData.ruleSet = deepMerge(this.moduleData.ruleSet, toCopy);
  }
}
