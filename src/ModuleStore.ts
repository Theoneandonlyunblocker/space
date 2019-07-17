/// <reference path="../node_modules/@types/requirejs/index.d.ts" />

import {GameModule} from "./GameModule";
import {ModuleInfo} from "./ModuleInfo";
import * as semver from "./versions";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";
import * as debug from "./debug";



export class ModuleStore
{
  private readonly loadedModules: {[key: string]: ModuleInfo} = {};

  constructor()
  {

  }

  public add(toAdd: GameModule): void
  {
    const existingModuleWithSameKey = this.loadedModules[toAdd.info.key];
    if (existingModuleWithSameKey)
    {
      const moduleVersionToUse = this.getModuleWithPriority(existingModuleWithSameKey, toAdd.info);

      if (moduleVersionToUse !== existingModuleWithSameKey)
      {
        debug.log("modules", `Replacing stored module '${toAdd.info.key}@${toAdd.info.version}' with newer version '${existingModuleWithSameKey.version}'`);
      }
      else
      {
        return;
      }
    }

    this.loadedModules[toAdd.info.key] = toAdd.info;

    if (toAdd.subModules)
    {
      toAdd.subModules.forEach(subModule => this.add(subModule));
    }
  }
  public getModules(...requestedModules: ModuleInfo[]): Promise<GameModule[]>
  {
    const modulesToGet = this.resolveRequestedModules(...requestedModules);
    const ordered = this.getModuleLoadOrder(...modulesToGet);

    return this.requireModules(...ordered);
  }

  private async requireModules(...modules: ModuleInfo[]): Promise<GameModule[]>
  {
    await Promise.all(modules.map(moduleInfo =>
    {
      return this.fetchBundle(moduleInfo);
    }));

    return Promise.all(modules.map(moduleInfo =>
    {
      const promise: Promise<GameModule> = new Promise(resolve =>
      {
        require([moduleInfo.moduleObjRequireJsName], (importedModule: any) =>
        {
          const gameModule: GameModule = importedModule[moduleInfo.gameModuleVariableName];
          this.add(gameModule);

          resolve(gameModule);
        });
      });

      return promise;
    }));
  }
  private fetchBundle(moduleInfo: ModuleInfo): Promise<void>
  {
    const loadedModule = this.loadedModules[moduleInfo.key];

    if (loadedModule)
    {
      const loadedModuleHasPriority =
        this.getModuleWithPriority(loadedModule, moduleInfo) === loadedModule;

      if (loadedModuleHasPriority)
      {
        return Promise.resolve();
      }
    }

    // remote
    return this.fetchRemoteBundle(moduleInfo).catch(reason =>
    {
      throw new Error(`Couldn't fetch module '${moduleInfo.key}'.\n${reason}`);
    });
  }
  private fetchRemoteBundle(moduleInfo: ModuleInfo): Promise<void>
  {
    const url = new URL(moduleInfo.moduleBundleUrl).toString();
    if (url.substring(url.length - 3, url.length) !== ".js")
    {
      throw new Error(`Module file URL must end in '.js'.` +
      ` Module '${moduleInfo.key}' specifies URL as ${url}`);
    }

    return new Promise((resolve, reject) =>
    {
      require([url], (definesBundle: any) =>
      {
        resolve();
      }, (error: any) =>
      {
        reject(error);
      });
    });
  }
  private getModuleLoadOrder(...modules: ModuleInfo[]): ModuleInfo[]
  {
    const dependencyGraph = new ModuleDependencyGraph(modules);

    return dependencyGraph.getOrderedNodes();
  }
  private resolveRequestedModules(...requestedModules: ModuleInfo[]): ModuleInfo[]
  {
    const allModules = {...this.loadedModules};
    const replacements: {[toBeReplacedKey: string]: string} = {};

    requestedModules.forEach(requestedModule =>
    {
      const storedModule = allModules[requestedModule.key];
      if (storedModule)
      {
        const versionWithPriority = this.getModuleWithPriority(storedModule, requestedModule);
        if (versionWithPriority === storedModule)
        {
          replacements[requestedModule.key] = storedModule.key;
          debug.log("modules", `Replacing module ${requestedModule.key}@${requestedModule.version} with ${storedModule.key}@${storedModule.version}`);
        }
      }
    });

    Object.keys(allModules).forEach(moduleKey =>
    {
      const moduleInfo = allModules[moduleKey];

      if (moduleInfo.modsToReplace)
      {
        moduleInfo.modsToReplace.forEach(toBeReplacedKey =>
        {
          if (replacements[toBeReplacedKey])
          {
            throw new Error(`Modules '${replacements[toBeReplacedKey]}' & '${moduleInfo.key}' tried to both replace module '${toBeReplacedKey}'`);
          }

          replacements[toBeReplacedKey] = moduleInfo.key;

          debug.log("modules", `Replacing module '${toBeReplacedKey}' with module '${moduleInfo.key}'`);
        });
      }
    });

    const resolved = requestedModules.map(moduleInfo =>
    {
      const replacingModuleInfo = allModules[replacements[moduleInfo.key]];

      if (replacingModuleInfo)
      {
        return replacingModuleInfo;
      }
      else
      {
        return moduleInfo;
      }
    });

    return resolved;
  }
  private getModuleWithPriority(a: ModuleInfo, b: ModuleInfo): ModuleInfo
  {
    // could check which matches game version here

    const getModuleToReturn = (sortResult: number) =>
    {
      if (sortResult > 0)
      {
        return a;
      }
      else if (sortResult < 0)
      {
        return b;
      }
      else
      {
        throw new Error(`Invalid sort result '${sortResult}'`);
      }
    };

    if (a.key !== b.key)
    {
      throw new Error(`Tried to compare versions with 2 different modules: ${a.key} <=> ${b.key}`);
    }

    const newnessSort = semver.compare(a.version, b.version);
    if (newnessSort)
    {
      return getModuleToReturn(newnessSort);
    }

    // modules have equal version
    return a;
  }
}

export const activeModuleStore = new ModuleStore();
