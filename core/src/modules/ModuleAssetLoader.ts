import {GameModule} from "./GameModule";
import
{
  GameModuleInitializationPhase,
  ValuesByGameModuleInitializationPhase,
} from "./GameModuleInitializationPhase";
import * as debug from "../app/debug";
import { ModuleStore } from "./ModuleStore";
import { AssetLoadingFunction } from "./AssetLoadingFunction";


type AssetLoaderWithModule =
{
  loaderFunction: AssetLoadingFunction;
  gameModule: GameModule;
};

export class ModuleAssetLoader
{
  private readonly moduleStore: ModuleStore;
  private readonly gameModulesByKey:
  {
    [moduleKey: string]: GameModule;
  } = {};
  private readonly assetLoadersByPhase: ValuesByGameModuleInitializationPhase<AssetLoaderWithModule[]> =
  {
    [GameModuleInitializationPhase.AppInit]: [],
    [GameModuleInitializationPhase.GameSetup]: [],
    [GameModuleInitializationPhase.MapGen]: [],
    [GameModuleInitializationPhase.GameStart]: [],
    [GameModuleInitializationPhase.BattlePrep]: [],
    [GameModuleInitializationPhase.BattleStart]: [],
  };
  private readonly assetLoadingPromisesByPhase: Partial<ValuesByGameModuleInitializationPhase<Promise<void>>> = {};

  constructor(moduleStore: ModuleStore, gameModules: GameModule[])
  {
    this.moduleStore = moduleStore;

    gameModules.forEach(gameModule => this.addGameModule(gameModule));
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
      throw new Error(`Duplicate GameModule ${gameModule.info.key}`);
    }

    this.gameModulesByKey[gameModule.info.key] = gameModule;

    if (gameModule.assetLoaders)
    {
      for (const phaseKey in gameModule.assetLoaders)
      {
        const phase = <GameModuleInitializationPhase><unknown>phaseKey;
        gameModule.assetLoaders[phase].forEach(assetLoader =>
        {
          this.assetLoadersByPhase[phase].push({loaderFunction: assetLoader, gameModule: gameModule});
        });
      }
    }
  }

  private loadAssetsForPhase(phase: GameModuleInitializationPhase): Promise<void>
  {
    if (!this.assetLoadingPromisesByPhase[phase])
    {
      const startTime = Date.now();
      debug.log("init", `Start loading assets for modules needed for ${GameModuleInitializationPhase[phase]}`);

      const loadersToExecute = this.assetLoadersByPhase[phase];

      this.assetLoadingPromisesByPhase[phase] = Promise.all(loadersToExecute.map(toLoad =>
      {
        const processedModuleBundleUrl = this.moduleStore.getUsedUrlFor(toLoad.gameModule.info);
        const baseUrl = new URL("./", processedModuleBundleUrl).toString();

        return toLoad.loaderFunction(baseUrl);
      })).then(() =>
      {
        const timeTaken = Date.now() - startTime;
        debug.log("init", `Finish loading assets for modules needed for ${GameModuleInitializationPhase[phase]} in ${timeTaken}ms`);
      });
    }

    return this.assetLoadingPromisesByPhase[phase];
  }
}
