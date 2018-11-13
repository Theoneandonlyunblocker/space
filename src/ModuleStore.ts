import {default as ModuleFile, ModuleMetaData} from "./ModuleFile";
import * as semver from "./versions";

export class ModuleStore
{
  readonly allMetaData: {[key: string]: ModuleMetaData} = {};
  readonly loadedModules: {[key: string]: ModuleFile} = {};

  constructor()
  {

  }

  // doesn't make much sense right now, as no module loading functionality has been implemented yet
  // should eventually fetch module files from a server
  public load(metaData: ModuleMetaData): Promise<ModuleFile>
  {
    // temp
    if (!this.loadedModules[metaData.key])
    {
      throw new Error(`Module '${metaData.key}' has not been loaded into the game.`);
    }

    return Promise.resolve(this.loadedModules[metaData.key]);
  }
  public add(moduleFile: ModuleFile): void
  {
    const existingModuleWithSameKey = this.loadedModules[moduleFile.metaData.key];
    if (existingModuleWithSameKey)
    {
      console.warn(`Duplicate stored module with key '${moduleFile.metaData.key}'`);

      const addedModuleIsNewer = semver.gt(
        moduleFile.metaData.version,
        existingModuleWithSameKey.metaData.version
      );

      if (addedModuleIsNewer)
      {
        console.warn(`Replacing stored module '${moduleFile.metaData.key}' with newer version '${existingModuleWithSameKey.metaData.version}'`);
      }
      else
      {
        return;
      }
    }

    this.loadedModules[moduleFile.metaData.key] = moduleFile;
  }
}

export const activeModuleStore = new ModuleStore();
