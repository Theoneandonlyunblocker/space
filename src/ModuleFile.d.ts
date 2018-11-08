import ModuleData from "./ModuleData";
import ModuleFileInitializationPhase from "./ModuleFileInitializationPhase";

import {Language} from "./localization/Language";


export interface ModuleMetaData
{
  key: string;
  version: string;
  author?: string;
  description?: string;
}

export interface ModuleFileSaveData<S = any>
{
  metaData: ModuleMetaData;
  moduleSaveData: S;
}

declare interface ModuleFile<S = any>
{
  metaData: ModuleMetaData;
  needsToBeInitializedBefore: ModuleFileInitializationPhase;
  supportedLanguages: Language[] | "all";
  initialize?: (callback: () => void) => void;
  addToModuleData?: (moduleData: ModuleData) => void;
  serialize?: () => S;
  reviveSaveData?: (oldSaveData: ModuleFileSaveData<any>) => void;
  deserialize?: (saveData: S) => void;
}

export default ModuleFile;
