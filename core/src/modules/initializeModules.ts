import {ModuleData} from "./ModuleData";
import { ModuleOrderingGraph } from "./ModuleOrderingGraph";
import {GameModule} from "./GameModule";


export function initializeModules(gameModules: GameModule[], moduleData: ModuleData): Promise<void>
{
  const modulesByKey: {[key: string]: GameModule} = {};
  const orderingGraph = new ModuleOrderingGraph();

  const modulesToInitialize = gameModules.filter(gameModule => Boolean(gameModule.addToModuleData));
  const allLoadingPromises: Promise<void>[] = [];

  modulesToInitialize.forEach(gameModule =>
  {
    orderingGraph.addModule(gameModule.info);
    modulesByKey[gameModule.info.key] = gameModule;
  });

  const orderedModulesToInitialize = orderingGraph.getOrderedNodes();
  orderedModulesToInitialize.forEach(moduleInfo =>
  {
    const gameModule = modulesByKey[moduleInfo.key];

    const loadingPromise = moduleData.addGameModule(gameModule);
    allLoadingPromises.push(loadingPromise);
  });

  return Promise.all(allLoadingPromises);
}
