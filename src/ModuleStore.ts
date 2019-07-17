/// <reference path="../node_modules/@types/requirejs/index.d.ts" />

import {GameModule} from "./GameModule";
import {ModuleInfo} from "./ModuleInfo";
import * as semver from "./versions";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";
import * as debug from "./debug";



export class ModuleStore
{
  private readonly allModuleInfo: {[key: string]: ModuleInfo} = {};
  private readonly loadedModules: {[key: string]: GameModule} = {};

  constructor()
  {

  }

  public add(toAdd: GameModule): void
  {
    const existingModuleWithSameKey = this.allModuleInfo[toAdd.info.key];
    if (existingModuleWithSameKey)
    {
      const moduleVersionToUse = this.getModuleVersionWithPriority(existingModuleWithSameKey, toAdd.info);

      if (moduleVersionToUse !== existingModuleWithSameKey)
      {
        console.log(`Replacing stored module '${toAdd.info.key}@${toAdd.info.version}' with newer version '${existingModuleWithSameKey.version}'`);
      }
      else
      {
        return;
      }
    }

    this.allModuleInfo[toAdd.info.key] = toAdd.info;
    this.loadedModules[toAdd.info.key] = toAdd;

    if (toAdd.subModules)
    {
      toAdd.subModules.forEach(subModule => this.add(subModule));
    }
  }
  public getModules(...requestedModules: ModuleInfo[]): Promise<GameModule[]>
  {
    const {result: replaced, replacements} = this.getModulesWithReplacements(...requestedModules);

    Object.keys(replacements).sort().forEach(wasReplaced =>
    {
      const didReplace = replacements[wasReplaced];

      debug.log("modules", `Replacing module '${wasReplaced}' with module '${didReplace}'`);
    });

    const ordered = this.getModuleLoadOrder(...replaced);

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

          resolve(gameModule);
        });
      });

      return promise;
    }));
  }
  private fetchBundle(moduleInfo: ModuleInfo): Promise<void>
  {
    // already in memory
    if (this.loadedModules[moduleInfo.key])
    {
      return Promise.resolve();
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
  private getModulesWithReplacements(
    ...requestedModules: ModuleInfo[]
  ): {result: ModuleInfo[]; replacements: {[toBeReplacedKey: string]: string}}
  {
    const allModules = {...this.allModuleInfo};
    requestedModules.forEach(moduleInfo =>
    {
      const existingModuleWithSameKey = allModules[moduleInfo.key];
      if (existingModuleWithSameKey)
      {
        allModules[moduleInfo.key] = this.getModuleVersionWithPriority(existingModuleWithSameKey, moduleInfo);
      }
      else
      {
        allModules[moduleInfo.key] = moduleInfo;
      }
    });

    const replacements: {[toBeReplacedKey: string]: string} = {};
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
        });
      }
    });

    const replaced = requestedModules.map(moduleInfo =>
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

    return(
    {
      result: replaced,
      replacements: replacements,
    });
  }
  private getModuleVersionWithPriority(a: ModuleInfo, b: ModuleInfo): ModuleInfo
  {
    // could check which matches game version here

    const getModuleToReturn = (sortResult: number) =>
    {
      if (sortResult === 1)
      {
        return b;
      }
      else if (sortResult === -1)
      {
        return a;
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
