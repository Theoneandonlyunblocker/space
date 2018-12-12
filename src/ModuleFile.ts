import ModuleData from "./ModuleData";
import ModuleFileInitializationPhase from "./ModuleFileInitializationPhase";

import {Language} from "./localization/Language";


export interface ModuleInfo
{
  key: string;
  // displayName: string;
  version: string;
  author?: string;
  description?: string;
  modsToLoadBefore?: string[];
  modsToLoadAfter?: string[];
  // should be used very, very sparingly. only if this mod completely replaces another's functionality
  modsToReplace?: string[];
}

export interface ModuleSaveData<S = any>
{
  info: ModuleInfo;
  moduleSaveData: S;
}

interface ModuleFile<SaveData = any>
{
  info: ModuleInfo;
  phaseToInitializeBefore: ModuleFileInitializationPhase;
  supportedLanguages: Language[] | "all";
  // not guaranteed to be loaded after main module. use ModuleFile.info.modsToLoadBefore/After to set order
  subModules?: ModuleFile[];
  initialize?: () => Promise<void>;
  addToModuleData?: (moduleData: ModuleData) => void;
  serializeModuleSpecificData?: () => SaveData;
  deserializeModuleSpecificData?: (saveData: SaveData) => void;
  reviveGameData?: (saveData: any) => void;
}

export default ModuleFile;
