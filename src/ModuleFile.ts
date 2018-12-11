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
  // initialized after main module
  subModules?: ModuleFile[];
  initialize?: () => Promise<void>;
  addToModuleData?: (moduleData: ModuleData) => void;
  serializeModuleSpecificData?: () => SaveData;
  deserializeModuleSpecificData?: (saveData: SaveData) => void;
  reviveGameData?: (saveData: any) => void;
}

export default ModuleFile;
