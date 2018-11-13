import ModuleData from "./ModuleData";
import ModuleFile from "./ModuleFile";
import
{
  default as ModuleFileInitializationPhase,
  allModuleFileInitializationPhases,
} from "./ModuleFileInitializationPhase";


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
  private readonly moduleInitializationPromises:
  {
    [key: string]: Promise<void>;
  } = {};
  private readonly moduleInitalizationStart:
  {
    [key: string]: number;
  } = {};

  constructor(moduleData: ModuleData)
  {
    this.moduleData = moduleData;

    allModuleFileInitializationPhases.forEach(phase =>
    {
      this.moduleFilesByPhase[phase] = [];
    });
  }

  public addModuleFile(moduleFile: ModuleFile)
  {
    if (this.moduleFilesByKey[moduleFile.metaData.key])
    {
      throw new Error(`Duplicate module key ${moduleFile.metaData.key}`);
    }

    this.moduleFilesByKey[moduleFile.metaData.key] = moduleFile;
    this.moduleInitalizationStart[moduleFile.metaData.key] = undefined;
    delete this.moduleInitalizationStart[moduleFile.metaData.key];

    this.moduleFilesByPhase[moduleFile.needsToBeInitializedBefore].push(moduleFile);
  }
  public initModulesNeededForPhase(phaseToInitUpTo: ModuleFileInitializationPhase): Promise<void[]>
  {
    const phasesNeeded: ModuleFileInitializationPhase[] = Object.keys(this.moduleFilesByPhase).map(phaseString =>
    {
      return Number(phaseString);
    }).filter(phase =>
    {
      return phase <= phaseToInitUpTo;
    }).sort();

    const allPromises = phasesNeeded.map(phase => this.initModulesForPhase(phase));

    return Promise.all(allPromises);
  }
  public progressivelyInitModulesByPhase(startingPhase: ModuleFileInitializationPhase): void
  {
    this.initModulesForPhase(startingPhase).then(() =>
    {
      const nextPhase = startingPhase + 1;
      if (this.moduleFilesByPhase[nextPhase])
      {
        this.progressivelyInitModulesByPhase(nextPhase);
      }
    });
  }

  private initModuleFile(moduleFile: ModuleFile): Promise<void>
  {
    if (!this.moduleFilesByKey[moduleFile.metaData.key])
    {
      this.addModuleFile(moduleFile);
    }

    if (this.moduleInitializationPromises[moduleFile.metaData.key])
    {
      return this.moduleInitializationPromises[moduleFile.metaData.key];
    }

    debug.log("modules", `Start initializing module "${moduleFile.metaData.key}"`);
    this.moduleInitalizationStart[moduleFile.metaData.key] = Date.now();

    const promise = new Promise<void>(resolve =>
    {
      if (moduleFile.initialize)
      {
        moduleFile.initialize(() =>
        {
          this.finishInitializingModuleFile(moduleFile);
          resolve();
        });
      }
      else
      {
        this.finishInitializingModuleFile(moduleFile);
        resolve();
      }
    });

    this.moduleInitializationPromises[moduleFile.metaData.key] = promise;

    return promise;
  }
  private initModuleFiles(moduleFiles: ModuleFile[]): Promise<void[]>
  {
    return Promise.all(moduleFiles.map(moduleFile =>
    {
      return this.initModuleFile(moduleFile);
    }));
  }
  private initModulesForPhase(phase: ModuleFileInitializationPhase): Promise<void>
  {
    if (this.hasStartedInitializingAllModulesForPhase(phase))
    {
      return Promise.resolve();
    }

    const startTime = Date.now();
    const moduleFilesToInit = this.moduleFilesByPhase[phase];

    debug.log("init", `Start initializing modules needed for ${ModuleFileInitializationPhase[phase]}`);

    return this.initModuleFiles(moduleFilesToInit).then(() =>
    {
      const timeTaken = Date.now() - startTime;

      debug.log("init", `Finish initializing modules needed for ${ModuleFileInitializationPhase[phase]} in ${timeTaken}ms`);
    });
  }
  private finishInitializingModuleFile(moduleFile: ModuleFile)
  {
    this.constructModuleFile(moduleFile);

    const timeTaken = Date.now() - this.moduleInitalizationStart[moduleFile.metaData.key];
    debug.log("modules", `Finish initializing module '${moduleFile.metaData.key}'  in ${timeTaken}ms`);
  }
  private hasStartedInitializingAllModulesForPhase(phase: ModuleFileInitializationPhase): boolean
  {
    return this.moduleFilesByPhase[phase].every(moduleFile =>
    {
      return isFinite(this.moduleInitalizationStart[moduleFile.metaData.key]);
    });
  }
  private constructModuleFile(moduleFile: ModuleFile)
  {
    if (moduleFile.addToModuleData)
    {
      moduleFile.addToModuleData(this.moduleData);
    }

    this.moduleData.addSubModule(moduleFile);
  }
}
