import ModuleData from "./ModuleData";
import ModuleFileInitializationPhase from "./ModuleFileInitializationPhase";

import {Language} from "./localization/Language";


export interface ModuleInfo
{
  key: string;
  // name: string;
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
  // TODO 2018.12.11 | replace instances of 'metaData'
  info: ModuleInfo;
  phaseToInitializeBefore: ModuleFileInitializationPhase;
  supportedLanguages: Language[] | "all";
  // not guaranteed to be initialized after main module. use ModuleFile.info.modsToLoadBefore/After to set order
  subModules?: ModuleFile[];
  // TODO 2018.12.10 | doesn't actually respect module order. should check dependant mods whether to block or not
  initialize?: () => Promise<void>;
  addToModuleData?: (moduleData: ModuleData) => void;
  serializeModuleSpecificData?: () => SaveData;
  deserializeModuleSpecificData?: (saveData: SaveData) => void;
  reviveGameData?: (saveData: any) => void;
}

export default ModuleFile;
