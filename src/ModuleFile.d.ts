import ModuleData from "./ModuleData";
import ModuleFileLoadingPhase from "./ModuleFileLoadingPhase";

interface ModuleMetaData
{
  name: string;
  version: string;
  author: string;
  description: string;
}

declare interface ModuleFile
{
  key: string;
  metaData: ModuleMetaData;
  needsToBeLoadedBefore: ModuleFileLoadingPhase;
  loadAssets?: (callback: Function) => void;
  constructModule?: (ModuleData: ModuleData) => void;
}

export default ModuleFile;
