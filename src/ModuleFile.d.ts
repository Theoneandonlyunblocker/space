import ModuleData from "./ModuleData.ts";
import
{
  RuleSet
} from "./ruleSet.ts";

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
  loadAssets: (callback: Function) => void;
  constructModule: (ModuleData: ModuleData) => ModuleData;
  ruleSet?: RuleSet;
}

export default ModuleFile;
