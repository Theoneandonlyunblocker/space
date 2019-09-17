import {GameModule} from "./GameModule";
import
{
  GameModuleInitializationPhase,
  ValuesByGameModuleInitializationPhase,
  GameModuleAssetLoader,
} from "./GameModuleInitialization";
import * as debug from "../app/debug";
import { ModuleStore } from "./ModuleStore";


type AssetLoaderWithModule =
{
  loaderFunction: GameModuleAssetLoader;
  module: GameModule;
};

export class ModuleAssetLoader
{
  private readonly moduleStore: ModuleStore;
  private readonly gameModulesByKey:
  {
    [moduleKey: string]: GameModule;
  } = {};
  private readonly assetLoadersByPhase: ValuesByGameModuleInitializationPhase<AssetLoaderWithModule[]>;
  private readonly assetLoadingPromisesByPhase: ValuesByGameModuleInitializationPhase<Promise<void>>;

  constructor(moduleStore: ModuleStore, gameModules: GameModule[])
  {
    this.moduleStore = moduleStore;

    gameModules.forEach(gameModule => this.addGameModule(gameModule));
    this.assetLoadersByPhase = ModuleAssetLoader.groupAssetLoaders(gameModules);
  }

  public loadAssetsNeededForPhase(phaseToInitUpTo: GameModuleInitializationPhase): Promise<void>
  {
    const phasesNeeded: GameModuleInitializationPhase[] = Object.keys(this.assetLoadersByPhase).map(phaseString =>
    {
      return Number(phaseString);
    }).filter(phase =>
    {
      return phase <= phaseToInitUpTo;
    }).sort();

    const allPromises = phasesNeeded.map(phase => this.loadAssetsForPhase(phase));

    return Promise.all(allPromises);
  }
  public progressivelyLoadAssets(startingPhase: GameModuleInitializationPhase): void
  {
    this.loadAssetsForPhase(startingPhase).then(() =>
    {
      const nextPhase = startingPhase + 1;
      if (this.assetLoadersByPhase[nextPhase])
      {
        this.progressivelyLoadAssets(nextPhase);
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

    if (gameModule.assetLoaders)
    {
      for (const phase in gameModule.assetLoaders)
      {
        this.assetLoadersByPhase[phase].push(...gameModule.assetLoaders[phase]);
      }
    }
    // this.dependencyGraph.addModule(gameModule.info);
  }

  // private initGameModule(gameModule: GameModule): Promise<void>
  // {
  //   if (this.moduleInitializationPromises[gameModule.info.key])
  //   {
  //     return this.moduleInitializationPromises[gameModule.info.key];
  //   }

  //   const promise = this.initGameModuleParents(gameModule).then(() =>
  //   {
  //     debug.log("modules", `Start initializing module "${gameModule.info.key}"`);
  //     this.moduleInitalizationStart[gameModule.info.key] = Date.now();

  //     if (gameModule.initialize)
  //     {
  //       const processedModuleBundleUrl = this.moduleStore.getUsedUrlFor(gameModule.info);
  //       const baseUrl = new URL("./", processedModuleBundleUrl).toString();

  //       return gameModule.initialize(baseUrl);
  //     }
  //     else
  //     {
  //       return Promise.resolve();
  //     }
  //   }).then(() =>
  //   {
  //     this.finishInitializingGameModule(gameModule);
  //   });

  //   this.moduleInitializationPromises[gameModule.info.key] = promise;

  //   return promise;
  // }
  // private initGameModules(gameModules: GameModule[]): Promise<void>
  // {
  //   return Promise.all(gameModules.map(gameModule =>
  //   {
  //     return this.initGameModule(gameModule);
  //   }));
  // }
  private loadAssetsForPhase(phase: GameModuleInitializationPhase): Promise<void>
  {
    if (this.assetLoadingPromisesByPhase[phase])
    {
      return this.assetLoadingPromisesByPhase[phase];
    }

    const startTime = Date.now();


    debug.log("init", `Start loading assets for modules needed for ${GameModuleInitializationPhase[phase]}`);

    const loadersToExecute = this.assetLoadersByPhase[phase];

    return Promise.all(loadersToExecute.map(toLoad =>
    {
      const processedModuleBundleUrl = this.moduleStore.getUsedUrlFor(toLoad.module.info);
      const baseUrl = new URL("./", processedModuleBundleUrl).toString();

      return toLoad.loaderFunction(baseUrl);
    })).then(() =>
    {
      const timeTaken = Date.now() - startTime;

      debug.log("init", `Finish loading assets for modules needed for ${GameModuleInitializationPhase[phase]} in ${timeTaken}ms`);
    });
  }

  // private initGameModuleParents(gameModule: GameModule): Promise<void>
  // {
  //   const parents = this.dependencyGraph.getImmediateParentsOf(gameModule.info.key).map(parentInfo =>
  //   {
  //     return this.gameModulesByKey[parentInfo.key];
  //   });

  //   const parentInitPromises = parents.map(parentModule =>
  //   {
  //     return this.initGameModule(parentModule);
  //   });

  //   return Promise.all(parentInitPromises);
  // }
  // private finishInitializingGameModule(gameModule: GameModule)
  // {
  //   this.addGameModuleToModuleData(gameModule);

  //   const timeTaken = Date.now() - this.moduleInitalizationStart[gameModule.info.key];
  //   debug.log("modules", `Finish initializing module '${gameModule.info.key}' in ${timeTaken}ms`);
  // }
  // private hasStartedInitializingAllModulesForPhase(phase: GameModuleInitializationPhase): boolean
  // {
  //   return this.gameModulesByPhase[phase].every(gameModule =>
  //   {
  //     return isFinite(this.moduleInitalizationStart[gameModule.info.key]);
  //   });
  // }
  // private getModuleInitializationPromisesForPhase(phase: GameModuleInitializationPhase): Promise<void>[]
  // {
  //   return this.gameModulesByPhase[phase].map(gameModule =>
  //   {
  //     return this.moduleInitializationPromises[gameModule.info.key];
  //   });
  // }
  // private addGameModuleToModuleData(gameModule: GameModule)
  // {
  //   if (gameModule.addToModuleData)
  //   {
  //     gameModule.addToModuleData(this.moduleData);
  //   }

  //   this.moduleData.addGameModule(gameModule);
  // }

  private static groupAssetLoaders(gameModules: GameModule[]): ValuesByGameModuleInitializationPhase<AssetLoaderWithModule[]>
  {
    const assetLoadersByPhase: ValuesByGameModuleInitializationPhase<AssetLoaderWithModule[]> = gameModules.reduce((grouped, currentModule) =>
    {
      if (currentModule.assetLoaders)
      {
        for (const phase in currentModule.assetLoaders)
        {
          const loadersForPhase: GameModuleAssetLoader[] = currentModule.assetLoaders[phase];
          loadersForPhase.forEach(assetLoader =>
          {
            grouped[phase].push({loaderFunction: assetLoader, gameModule: currentModule});
          });
        }
      }

      return grouped;
    },
    {
      [GameModuleInitializationPhase.AppInit]: [],
      [GameModuleInitializationPhase.GameSetup]: [],
      [GameModuleInitializationPhase.MapGen]: [],
      [GameModuleInitializationPhase.GameStart]: [],
      [GameModuleInitializationPhase.BattlePrep]: [],
      [GameModuleInitializationPhase.BattleStart]: [],
    });

    return assetLoadersByPhase;
  }
}
