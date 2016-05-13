import Objectives from "./Objectives";

import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import ObjectiveTemplate from "../../src/templateinterfaces/ObjectiveTemplate";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.game,
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<ObjectiveTemplate>(Objectives, "Objectives");
    
    return moduleData;
  }
}

export default defaultAI;
