import ModuleData from "./ModuleData";
import ModuleFile from "./ModuleFile";
import ModuleFileInitializationPhase from "./ModuleFileInitializationPhase";

import eventManager from "./eventManager";


export default class ModuleInitializer
{
  private readonly moduleData: ModuleData;
  private readonly moduleFilesByKey:
  {
    [key: string]: ModuleFile;
  } = {};
  private readonly moduleFilesByPhase:
  {
    [phase: number]: ModuleFile[];
  } = {};
  private readonly hasInitialized:
  {
    [key: string]: boolean;
  } = {};
  private readonly moduleInitalizationStart:
  {
    [key: string]: number;
  } = {};
  private readonly moduleInitializationFinishCallbacks:
  {
    [key: string]: (() => void)[];
  } = {};

  constructor(moduleData: ModuleData)
  {
    this.moduleData = moduleData;

    eventManager.addEventListener("initModulesNeededForPhase", this.initModulesNeededForPhase.bind(this));
  }

  public addModuleFile(moduleFile: ModuleFile)
  {
    if (this.moduleFilesByKey[moduleFile.metaData.key])
    {
      throw new Error(`Duplicate module key ${moduleFile.metaData.key}`);
    }

    this.moduleFilesByKey[moduleFile.metaData.key] = moduleFile;
    this.hasInitialized[moduleFile.metaData.key] = false;

    if (!this.moduleFilesByPhase[moduleFile.needsToBeInitializedBefore])
    {
      this.moduleFilesByPhase[moduleFile.needsToBeInitializedBefore] = [];
    }

    this.moduleFilesByPhase[moduleFile.needsToBeInitializedBefore].push(moduleFile);
  }
  public initModuleFile(moduleFile: ModuleFile, afterInit: () => void)
  {
    if (!this.moduleFilesByKey[moduleFile.metaData.key])
    {
      this.addModuleFile(moduleFile);
    }

    if (this.hasInitialized[moduleFile.metaData.key])
    {
      afterInit();

      return;
    }

    if (!this.moduleInitializationFinishCallbacks[moduleFile.metaData.key])
    {
      this.moduleInitializationFinishCallbacks[moduleFile.metaData.key] = [];
    }
    this.moduleInitializationFinishCallbacks[moduleFile.metaData.key].push(afterInit);

    if (isFinite(this.moduleInitalizationStart[moduleFile.metaData.key]))
    {
      return;
    }
    console.log(`Start initializing module "${moduleFile.metaData.key}"`);

    this.moduleInitalizationStart[moduleFile.metaData.key] = Date.now();
    // TODO 2017.07.29 | keep track of what's already been loaded
    if (moduleFile.initialize)
    {
      moduleFile.initialize(() =>
      {
        this.finishInitializingModuleFile(moduleFile);
      });
    }
    else
    {
      this.finishInitializingModuleFile(moduleFile);
    }
  }
  public initModuleFiles(moduleFiles: ModuleFile[], afterInit?: () => void): void
  {
    if (!moduleFiles || moduleFiles.length < 1)
    {
      if (afterInit)
      {
        afterInit();
      }

      return;
    }

    const initializedModuleFiles: ModuleFile[] = [];

    const executeIfAllDone = () =>
    {
      if (initializedModuleFiles.length === moduleFiles.length)
      {
        if (afterInit)
        {
          afterInit();
        }
      }
    };

    moduleFiles.forEach(moduleFile =>
    {
      this.initModuleFile(moduleFile, () =>
      {
        initializedModuleFiles.push(moduleFile);
        if (afterInit)
        {
          executeIfAllDone();
        }
      });
    });
  }
  public initializeAll(afterInit: () => void)
  {
    const allModuleFiles: ModuleFile[] = [];
    for (const key in this.moduleFilesByKey)
    {
      allModuleFiles.push(this.moduleFilesByKey[key]);
    }

    this.initModuleFiles(allModuleFiles, afterInit);
  }
  public initModulesForPhase(phase: ModuleFileInitializationPhase, afterInitialized?: () => void): void
  {
    const moduleFilesToInit = this.moduleFilesByPhase[phase];
    this.initModuleFiles(moduleFilesToInit, afterInitialized);
  }
  public initModulesNeededForPhase(phaseToInitUpTo: ModuleFileInitializationPhase, afterInitialized?: () => void): void
  {
    const phasesNeeded: ModuleFileInitializationPhase[] = Object.keys(this.moduleFilesByPhase).map(phaseString =>
    {
      return <ModuleFileInitializationPhase> ModuleFileInitializationPhase[phaseString];
    }).filter(phase =>
    {
      return phase <= phaseToInitUpTo;
    }).sort();

    phasesNeeded.forEach(phase => this.initModulesForPhase(phase));
  }
  public progressivelyInitModulesByPhase(startingPhase: ModuleFileInitializationPhase): void
  {
    this.initModulesForPhase(startingPhase, () =>
    {
      if (ModuleFileInitializationPhase[startingPhase + 1])
      {
        this.progressivelyInitModulesByPhase(startingPhase + 1);
      }
    });
  }
  private finishInitializingModuleFile(moduleFile: ModuleFile)
  {
    this.hasInitialized[moduleFile.metaData.key] = true;
    this.constructModuleFile(moduleFile);

    const initTime = Date.now() - this.moduleInitalizationStart[moduleFile.metaData.key];
    console.log(`Module "${moduleFile.metaData.key}" finished loading in ${initTime}ms`);

    while (this.moduleInitializationFinishCallbacks[moduleFile.metaData.key].length > 0)
    {
      const afterInitCallback = this.moduleInitializationFinishCallbacks[moduleFile.metaData.key].pop()!;
      afterInitCallback();
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
