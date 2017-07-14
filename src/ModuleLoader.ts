import ModuleData from "./ModuleData";
import ModuleFile from "./ModuleFile";
import ModuleFileLoadingPhase from "./ModuleFileLoadingPhase";

import eventManager from "./eventManager";

export default class ModuleLoader
{
  moduleData: ModuleData;
  moduleFilesByKey:
  {
    [key: string]: ModuleFile;
  } = {};
  moduleFilesByPhase:
  {
    [phase: number]: ModuleFile[];
  } = {};
  hasLoaded:
  {
    [key: string]: boolean;
  } = {};
  moduleLoadStart:
  {
    [key: string]: number;
  } = {};
  moduleLoadFinishCallbacks:
  {
    [key: string]: (() => void)[];
  } = {};
  constructor(moduleData: ModuleData)
  {
    this.moduleData = moduleData;

    eventManager.addEventListener("loadModulesNeededForPhase", this.loadModulesNeededForPhase.bind(this));
  }

  public addModuleFile(moduleFile: ModuleFile)
  {
    if (this.moduleFilesByKey[moduleFile.key])
    {
      throw new Error("Duplicate module key " + moduleFile.key);
    }

    this.moduleFilesByKey[moduleFile.key] = moduleFile;
    this.hasLoaded[moduleFile.key] = false;

    if (!this.moduleFilesByPhase[moduleFile.needsToBeLoadedBefore])
    {
      this.moduleFilesByPhase[moduleFile.needsToBeLoadedBefore] = [];
    }

    this.moduleFilesByPhase[moduleFile.needsToBeLoadedBefore].push(moduleFile);
  }
  public loadModuleFile(moduleFile: ModuleFile, afterLoaded: () => void)
  {
    if (!this.moduleFilesByKey[moduleFile.key])
    {
      this.addModuleFile(moduleFile);
    }

    if (this.hasLoaded[moduleFile.key])
    {
      afterLoaded();
      return;
    }

    if (!this.moduleLoadFinishCallbacks[moduleFile.key])
    {
      this.moduleLoadFinishCallbacks[moduleFile.key] = [];
    }
    this.moduleLoadFinishCallbacks[moduleFile.key].push(afterLoaded);

    if (isFinite(this.moduleLoadStart[moduleFile.key]))
    {
      return;
    }
    console.log("start loading module '", moduleFile.key, "'");

    this.moduleLoadStart[moduleFile.key] = Date.now();
    if (moduleFile.loadAssets)
    {
      moduleFile.loadAssets(() =>
      {
        this.finishLoadingModuleFile(moduleFile);
      });
    }
    else
    {
      this.finishLoadingModuleFile(moduleFile);
    }
  }
  public loadModuleFiles(moduleFilesToLoad: ModuleFile[], afterLoaded?: () => void): void
  {
    if (!moduleFilesToLoad || moduleFilesToLoad.length < 1)
    {
      if (afterLoaded)
      {
        afterLoaded();
      }

      return;
    }

    const loadedModuleFiles: ModuleFile[] = [];

    const executeIfAllLoaded = () =>
    {
      if (loadedModuleFiles.length === moduleFilesToLoad.length)
      {
        afterLoaded();
      }
    };

    moduleFilesToLoad.forEach(moduleFile =>
    {
      this.loadModuleFile(moduleFile, () =>
      {
        loadedModuleFiles.push(moduleFile);
        if (afterLoaded)
        {
          executeIfAllLoaded();
        }
      });
    });
  }
  public loadAll(afterLoaded: () => void)
  {
    const allModuleFiles: ModuleFile[] = [];
    for (let key in this.moduleFilesByKey)
    {
      allModuleFiles.push(this.moduleFilesByKey[key]);
    }

    this.loadModuleFiles(allModuleFiles, afterLoaded);
  }
  public loadModulesForPhase(phase: ModuleFileLoadingPhase, afterLoaded?: () => void): void
  {
    const moduleFilesToLoad = this.moduleFilesByPhase[phase];
    this.loadModuleFiles(moduleFilesToLoad, afterLoaded);
  }
  public loadModulesNeededForPhase(phase: ModuleFileLoadingPhase, afterLoaded?: () => void): void
  {
    const moduleFilesNeededForPhase: ModuleFile[] = [];

    for (let keyString in this.moduleFilesByPhase)
    {
      if (parseInt(keyString) <= phase)
      {
        moduleFilesNeededForPhase.push(...this.moduleFilesByPhase[keyString]);
      }
    }

    this.loadModuleFiles(moduleFilesNeededForPhase, afterLoaded);
  }
  public progressivelyLoadModulesByPhase(startingPhase: ModuleFileLoadingPhase): void
  {
    this.loadModulesForPhase(startingPhase, () =>
    {
      if (ModuleFileLoadingPhase[startingPhase + 1])
      {
        this.progressivelyLoadModulesByPhase(startingPhase + 1);
      }
    });
  }
  private finishLoadingModuleFile(moduleFile: ModuleFile)
  {
    this.hasLoaded[moduleFile.key] = true;
    this.constructModuleFile(moduleFile);
    const loadTime = Date.now() - this.moduleLoadStart[moduleFile.key];
    console.log("Module '" + moduleFile.key + "' finished loading in " + loadTime + "ms");

    while (this.moduleLoadFinishCallbacks[moduleFile.key].length > 0)
    {
      const afterLoadedCallback = this.moduleLoadFinishCallbacks[moduleFile.key].pop();
      afterLoadedCallback();
    }
  }
  private constructModuleFile(moduleFile: ModuleFile)
  {
    if (moduleFile.constructModule)
    {
      moduleFile.constructModule(this.moduleData);
    }

    this.moduleData.addSubModule(moduleFile);
  }
}
