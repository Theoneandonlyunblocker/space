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

export interface ModuleFileGameSaveData<S = any>
{
  metaData: ModuleMetaData;
  moduleSaveData: S;
}

declare interface ModuleFile<SaveData = any>
{
  metaData: ModuleMetaData;
  needsToBeInitializedBefore: ModuleFileInitializationPhase;
  supportedLanguages: Language[] | "all";
  initialize?: (callback: () => void) => void;
  addToModuleData?: (moduleData: ModuleData) => void;
  serializeGameSpecificData?: () => SaveData;
  deserializeGameSpecificData?: (saveData: SaveData) => void;
  reviveGameSpecificData?: (oldSaveData: ModuleFileGameSaveData<any>) => void;
}

export default ModuleFile;
