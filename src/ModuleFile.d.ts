import ModuleData from "./ModuleData";

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
  loadAssets?: (callback: Function) => void;
  constructModule?: (ModuleData: ModuleData) => void;
}

export default ModuleFile;
