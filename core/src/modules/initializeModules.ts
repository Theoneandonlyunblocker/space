import {ModuleData} from "./ModuleData";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";
import {GameModule} from "./GameModule";


export function initializeModules(gameModules: GameModule[], moduleData: ModuleData): Promise<void>
{
  const modulesByKey: {[key: string]: GameModule} = {};
  const dependencyGraph = new ModuleDependencyGraph();

  const modulesToInitialize = gameModules.filter(gameModule => Boolean(gameModule.addToModuleData));
  const allLoadingPromises: Promise<void>[] = [];

  modulesToInitialize.forEach(gameModule =>
  {
    dependencyGraph.addModule(gameModule.info);
    modulesByKey[gameModule.info.key] = gameModule;
  });

  const orderedModulesToInitialize = dependencyGraph.getOrderedNodes();
  orderedModulesToInitialize.forEach(moduleInfo =>
  {
    const gameModule = modulesByKey[moduleInfo.key];

    const loadingPromise = moduleData.addGameModule(gameModule);
    allLoadingPromises.push(loadingPromise);
  });

  return Promise.all(allLoadingPromises);
}
