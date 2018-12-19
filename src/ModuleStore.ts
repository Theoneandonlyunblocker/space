/// <reference path="../node_modules/@types/requirejs/index.d.ts" />

import ModuleFile from "./ModuleFile";
import {ModuleInfo} from "./ModuleInfo";
import * as semver from "./versions";
import { ModuleDependencyGraph } from "./ModuleDependencyGraph";
import * as debug from "./debug";


export class ModuleStore
{
  private readonly allModuleInfo: {[key: string]: ModuleInfo} = {};
  private readonly loadedModules: {[key: string]: ModuleFile} = {};

  constructor()
  {

  }

  public add(toAdd: ModuleFile): void
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
  public getModules(...requestedModules: ModuleInfo[]): Promise<ModuleFile[]>
  {
    const {result: replaced, replacements} = this.getModulesWithReplacements(...requestedModules);

    Object.keys(replacements).sort().forEach(wasReplaced =>
    {
      const didReplace = replacements[wasReplaced];

      debug.log("modules", `Replacing module '${wasReplaced}' with module '${didReplace}'`);
    });

    const ordered = this.getModuleLoadOrder(...replaced);

    return Promise.all(ordered.map(moduleInfo =>  this.load(moduleInfo)));
  }

  // doesn't make much sense right now, as no module loading functionality has been implemented yet
  // should eventually fetch module files from a server / local file system
  private load(moduleInfo: ModuleInfo): Promise<ModuleFile>
  {
    if (this.loadedModules[moduleInfo.key])
    {
      return Promise.resolve(this.loadedModules[moduleInfo.key]);
    }

    // local
    // remote
    return this.loadRemote(moduleInfo);

    // temp
    if (!this.loadedModules[moduleInfo.key])
    {
      throw new Error(`Couldn't load module '${moduleInfo.key}'.`);
    }
  }
  private loadLocal(moduleInfo: ModuleInfo): Promise<ModuleFile>
  {

  }
  private loadRemote(moduleInfo: ModuleInfo): Promise<ModuleFile>
  {
    if (!moduleInfo.remoteModuleInfoUrl)
    {
      throw new Error(`Module '${moduleInfo.key}' has no URL specified for remote loading.`);
    }

    let url = new URL(moduleInfo.moduleFileUrl, moduleInfo.remoteModuleInfoUrl).toString();
    if (url.substring(url.length - 3, url.length) !== ".js")
    {
      throw new Error(`Module file URL must end in '.js'.` +
      ` Module ${moduleInfo.key} specifies URL as ${url}`);
    }

    // strip file extension, as it's added by onNodeCreated hook
    // otherwise requirejs doesn't know how to handle relative paths in file loaded via absolute path
    url = url.slice(0, url.length - 3);

    return new Promise((resolve, reject) =>
    {
      requirejs([url], (a: any) =>
      {
        const moduleFile = a[moduleInfo.moduleFileVariableName];

        resolve(moduleFile);
      }, (error: any) =>
      {
        // TODO 2019.04.02 | what do we do here?
        console.error(`require ${url} failed`);

        reject();
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
