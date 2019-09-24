import {ModuleData} from "./ModuleData";
import {ModuleInfo} from "./ModuleInfo";
import {ValuesByGameModuleInitializationPhase} from "./GameModuleInitializationPhase";

import {Language} from "../localization/Language";
import { AssetLoadingFunction } from "./AssetLoadingFunction";


export interface ModuleSaveData<S = any>
{
  info: ModuleInfo;
  moduleSaveData: S;
}

export interface GameModule<SaveData = any>
{
  info: ModuleInfo;
  supportedLanguages: Language[] | "all";
  assetLoaders?: Partial<ValuesByGameModuleInitializationPhase<AssetLoadingFunction[]>>;
  addToModuleData?: (moduleData: ModuleData) => void;
  serializeModuleSpecificData?: () => SaveData;
  deserializeModuleSpecificData?: (saveData: SaveData) => void;
  reviveGameData?: (saveData: any) => void;
}
