import ModuleData from "./ModuleData";
import ModuleFileLoadingPhase from "./ModuleFileLoadingPhase";

import {Language} from "./localization/Language";

interface ModuleMetaData
{
  key: string;
  version: string;
  author: string;
  description: string;
}

declare interface ModuleFile
{
  key: string;
  metaData: ModuleMetaData;
  needsToBeLoadedBefore: ModuleFileLoadingPhase;
  supportedLanguages: Language[] | "all";
  loadAssets?: (callback: () => void) => void;
  constructModule?: (moduleData: ModuleData) => void;
}

export default ModuleFile;
