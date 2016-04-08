import Objectives from "./Objectives.ts";

import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages.ts";
import ModuleData from "../../src/ModuleData.ts";
import ModuleFile from "../../src/ModuleFile.d.ts";
import RuleSet from "../../src/RuleSet.ts";

import ObjectiveTemplate from "../../src/templateinterfaces/ObjectiveTemplate.d.ts";

const defaultAI: ModuleFile =
{
  key: "defaultAI",
  metaData:
  {
    name: "Default AI",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<ObjectiveTemplate>(Objectives, "Objectives");
    
    return moduleData;
  }
}

export default defaultAI;
