import ModuleData from "./ModuleData";
import ModuleFile from "./ModuleFile";
import
{
  default as ModuleFileInitializationPhase,
  allModuleFileInitializationPhases,
} from "./ModuleFileInitializationPhase";
import * as debug from "./debug";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";


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
  private readonly dependencyGraph: ModuleDependencyGraph;

  constructor(moduleData: ModuleData, moduleFiles: ModuleFile[])
  {
    this.moduleData = moduleData;
    this.dependencyGraph = new ModuleDependencyGraph();

    allModuleFileInitializationPhases.forEach(phase =>
    {
      this.moduleFilesByPhase[phase] = [];
    });

    moduleFiles.forEach(moduleFile => this.addModuleFile(moduleFile));
  }

  public initModulesNeededForPhase(phaseToInitUpTo: ModuleFileInitializationPhase): Promise<void>
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

  private addModuleFile(moduleFile: ModuleFile)
  {
    if (this.moduleFilesByKey[moduleFile.info.key])
    {
      return;
    }

    this.moduleFilesByKey[moduleFile.info.key] = moduleFile;

    this.moduleFilesByPhase[moduleFile.phaseToInitializeBefore].push(moduleFile);
    this.dependencyGraph.addModule(moduleFile.info);

    if (moduleFile.subModules)
    {
      moduleFile.subModules.forEach(subModule => this.addModuleFile(subModule));
    }
  }
  private initModuleFile(moduleFile: ModuleFile): Promise<void>
  {
    if (this.moduleInitializationPromises[moduleFile.info.key])
    {
      return this.moduleInitializationPromises[moduleFile.info.key];
    }

    const promise = this.initModuleFileParents(moduleFile).then(() =>
    {
      debug.log("modules", `Start initializing module "${moduleFile.info.key}"`);
      this.moduleInitalizationStart[moduleFile.info.key] = Date.now();

      if (moduleFile.initialize)
      {
        console.log(moduleFile.info.moduleFileUrl)
        const baseUrl = new URL("./", moduleFile.info.moduleFileUrl).toString();

        return moduleFile.initialize(baseUrl);
      }
      else
      {
        return Promise.resolve();
      }
    }).then(() =>
    {
      this.finishInitializingModuleFile(moduleFile);
    });

    this.moduleInitializationPromises[moduleFile.info.key] = promise;

    return promise;
  }
  private initModuleFiles(moduleFiles: ModuleFile[]): Promise<void>
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
      return Promise.all(this.getModuleInitializationPromisesForPhase(phase));
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
  private initModuleFileParents(moduleFile: ModuleFile): Promise<void>
  {
    const parents = this.dependencyGraph.getImmediateParentsOf(moduleFile.info.key).map(parentInfo =>
    {
      return this.moduleFilesByKey[parentInfo.key];
    });

    const parentInitPromises = parents.map(parentModule =>
    {
      return this.initModuleFile(parentModule);
    });

    return Promise.all(parentInitPromises);
  }
  private finishInitializingModuleFile(moduleFile: ModuleFile)
  {
    this.constructModuleFile(moduleFile);

    const timeTaken = Date.now() - this.moduleInitalizationStart[moduleFile.info.key];
    debug.log("modules", `Finish initializing module '${moduleFile.info.key}' in ${timeTaken}ms`);
  }
  private hasStartedInitializingAllModulesForPhase(phase: ModuleFileInitializationPhase): boolean
  {
    return this.moduleFilesByPhase[phase].every(moduleFile =>
    {
      return isFinite(this.moduleInitalizationStart[moduleFile.info.key]);
    });
  }
  private getModuleInitializationPromisesForPhase(phase: ModuleFileInitializationPhase): Promise<void>[]
  {
    return this.moduleFilesByPhase[phase].map(moduleFile =>
    {
      return this.moduleInitializationPromises[moduleFile.info.key];
    });
  }
  private constructModuleFile(moduleFile: ModuleFile)
  {
    if (moduleFile.addToModuleData)
    {
      moduleFile.addToModuleData(this.moduleData);
    }

    this.moduleData.addModuleFile(moduleFile);
  }
}
