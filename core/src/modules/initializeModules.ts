import {ModuleData} from "./ModuleData";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";
import {GameModule} from "./GameModule";


export function initializeModules(gameModules: GameModule[], moduleData: ModuleData): void
{
  const modulesByKey: {[key: string]: GameModule} = {};
  const dependencyGraph = new ModuleDependencyGraph();

  const modulesToInitialize = gameModules.filter(gameModule => Boolean(gameModule.addToModuleData));

  modulesToInitialize.forEach(gameModule =>
  {
    dependencyGraph.addModule(gameModule.info);
    modulesByKey[gameModule.info.key] = gameModule;
  });

  const orderedModulesToInitialize = dependencyGraph.getOrderedNodes();
  orderedModulesToInitialize.forEach(moduleInfo =>
  {
    const gameModule = modulesByKey[moduleInfo.key];

    moduleData.addGameModule(gameModule);
  });
}
