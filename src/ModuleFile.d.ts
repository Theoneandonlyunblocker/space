import ModuleData from "./ModuleData";
import RuleSet from "./RuleSet";

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
  constructModule?: (ModuleData: ModuleData) => ModuleData;
  ruleSet?: RuleSet;
}

export default ModuleFile;
