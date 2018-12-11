import {default as ModuleFile, ModuleInfo} from "./ModuleFile";
import * as semver from "./versions";
import { DependencyGraph } from "./DependencyGraph";
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
    // temp
    if (!this.loadedModules[moduleInfo.key])
    {
      throw new Error(`Couldn't load module '${moduleInfo.key}'.`);
    }

    return new Promise(resolve =>
    {
      resolve(this.loadedModules[moduleInfo.key]);
    });
  }
  private getModuleLoadOrder(...modules: ModuleInfo[]): ModuleInfo[]
  {
    const dependencyGraph = new DependencyGraph();

    modules.forEach(moduleInfo =>
    {
      dependencyGraph.addNode(moduleInfo.key);

      if (moduleInfo.modsToLoadAfter)
      {
        moduleInfo.modsToLoadAfter.forEach(child =>
        {
          dependencyGraph.addDependency(moduleInfo.key, child);
        });
      }

      if (moduleInfo.modsToLoadBefore)
      {
        moduleInfo.modsToLoadBefore.forEach(child =>
        {
          dependencyGraph.addDependency(child, moduleInfo.key);
        });
      }
    });

    const orderedKeys = dependencyGraph.getOrderedNodes();

    const modsByKey: {[key: string]: ModuleInfo} = {};
    modules.forEach(moduleInfo => modsByKey[moduleInfo.key] = moduleInfo);

    return orderedKeys.map(key => modsByKey[key]);
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
