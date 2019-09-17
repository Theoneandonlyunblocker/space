import {ModuleData} from "./ModuleData";
import {ModuleInfo} from "./ModuleInfo";
import {ValuesByGameModuleInitializationPhase, GameModuleAssetLoader} from "./GameModuleInitialization";

import {Language} from "../localization/Language";


export interface ModuleSaveData<S = any>
{
  info: ModuleInfo;
  moduleSaveData: S;
}

export interface GameModule<SaveData = any>
{
  info: ModuleInfo;
  supportedLanguages: Language[] | "all";
  assetLoaders?: Partial<ValuesByGameModuleInitializationPhase<GameModuleAssetLoader[]>>;
  addToModuleData?: (moduleData: ModuleData) => void;
  serializeModuleSpecificData?: () => SaveData;
  deserializeModuleSpecificData?: (saveData: SaveData) => void;
  reviveGameData?: (saveData: any) => void;
}
