import {ModuleData} from "./ModuleData";
import {GameModule} from "./GameModule";
import
{
  GameModuleInitializationPhase,
  allGameModuleInitializationPhases,
} from "./GameModuleInitializationPhase";
import * as debug from "./debug";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";
import { ModuleStore } from "./ModuleStore";


export class ModuleInitializer
{
  private readonly moduleData: ModuleData;
  private readonly gameModulesByKey:
  {
    [key: string]: GameModule;
  } = {};
  private readonly gameModulesByPhase:
  {
    [phase: number]: GameModule[];
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

  constructor(moduleData: ModuleData, gameModules: GameModule[])
  {
    this.moduleData = moduleData;
    this.dependencyGraph = new ModuleDependencyGraph();

    allGameModuleInitializationPhases.forEach(phase =>
    {
      this.gameModulesByPhase[phase] = [];
    });

    gameModules.forEach(gameModule => this.addGameModule(gameModule));
  }

  public initModulesNeededForPhase(phaseToInitUpTo: GameModuleInitializationPhase): Promise<void>
  {
    const phasesNeeded: GameModuleInitializationPhase[] = Object.keys(this.gameModulesByPhase).map(phaseString =>
    {
      return Number(phaseString);
    }).filter(phase =>
    {
      return phase <= phaseToInitUpTo;
    }).sort();

    const allPromises = phasesNeeded.map(phase => this.initModulesForPhase(phase));

    return Promise.all(allPromises);
  }
  public progressivelyInitModulesByPhase(startingPhase: GameModuleInitializationPhase): void
  {
    this.initModulesForPhase(startingPhase).then(() =>
    {
      const nextPhase = startingPhase + 1;
      if (this.gameModulesByPhase[nextPhase])
      {
        this.progressivelyInitModulesByPhase(nextPhase);
      }
    });
  }

  private addGameModule(gameModule: GameModule)
  {
    if (this.gameModulesByKey[gameModule.info.key])
    {
      return;
    }

    this.gameModulesByKey[gameModule.info.key] = gameModule;

    this.gameModulesByPhase[gameModule.phaseToInitializeBefore].push(gameModule);
    this.dependencyGraph.addModule(gameModule.info);

    if (gameModule.subModules)
    {
      gameModule.subModules.forEach(subModule => this.addGameModule(subModule));
    }
  }
  private initGameModule(gameModule: GameModule): Promise<void>
  {
    if (this.moduleInitializationPromises[gameModule.info.key])
    {
      return this.moduleInitializationPromises[gameModule.info.key];
    }

    const promise = this.initGameModuleParents(gameModule).then(() =>
    {
      debug.log("modules", `Start initializing module "${gameModule.info.key}"`);
      this.moduleInitalizationStart[gameModule.info.key] = Date.now();

      if (gameModule.initialize)
      {
        // TODO 2019.08.04 | shouldn't do this here
        const processedModuleBundleUrl = ModuleStore.processModuleBundleUrl(gameModule.info.moduleBundleUrl);
        const baseUrl = new URL("./", processedModuleBundleUrl).toString();

        return gameModule.initialize(baseUrl);
      }
      else
      {
        return Promise.resolve();
      }
    }).then(() =>
    {
      this.finishInitializingGameModule(gameModule);
    });

    this.moduleInitializationPromises[gameModule.info.key] = promise;

    return promise;
  }
  private initGameModules(gameModules: GameModule[]): Promise<void>
  {
    return Promise.all(gameModules.map(gameModule =>
    {
      return this.initGameModule(gameModule);
    }));
  }
  private initModulesForPhase(phase: GameModuleInitializationPhase): Promise<void>
  {
    if (this.hasStartedInitializingAllModulesForPhase(phase))
    {
      return Promise.all(this.getModuleInitializationPromisesForPhase(phase));
    }

    const startTime = Date.now();
    const gameModulesToInit = this.gameModulesByPhase[phase];

    debug.log("init", `Start initializing modules needed for ${GameModuleInitializationPhase[phase]}`);

    return this.initGameModules(gameModulesToInit).then(() =>
    {
      const timeTaken = Date.now() - startTime;

      debug.log("init", `Finish initializing modules needed for ${GameModuleInitializationPhase[phase]} in ${timeTaken}ms`);
    });
  }
  private initGameModuleParents(gameModule: GameModule): Promise<void>
  {
    const parents = this.dependencyGraph.getImmediateParentsOf(gameModule.info.key).map(parentInfo =>
    {
      return this.gameModulesByKey[parentInfo.key];
    });

    const parentInitPromises = parents.map(parentModule =>
    {
      return this.initGameModule(parentModule);
    });

    return Promise.all(parentInitPromises);
  }
  private finishInitializingGameModule(gameModule: GameModule)
  {
    this.constructGameModule(gameModule);

    const timeTaken = Date.now() - this.moduleInitalizationStart[gameModule.info.key];
    debug.log("modules", `Finish initializing module '${gameModule.info.key}' in ${timeTaken}ms`);
  }
  private hasStartedInitializingAllModulesForPhase(phase: GameModuleInitializationPhase): boolean
  {
    return this.gameModulesByPhase[phase].every(gameModule =>
    {
      return isFinite(this.moduleInitalizationStart[gameModule.info.key]);
    });
  }
  private getModuleInitializationPromisesForPhase(phase: GameModuleInitializationPhase): Promise<void>[]
  {
    return this.gameModulesByPhase[phase].map(gameModule =>
    {
      return this.moduleInitializationPromises[gameModule.info.key];
    });
  }
  private constructGameModule(gameModule: GameModule)
  {
    if (gameModule.addToModuleData)
    {
      gameModule.addToModuleData(this.moduleData);
    }

    this.moduleData.addGameModule(gameModule);
  }
}
