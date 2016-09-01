import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import AITemplateConstructor from "../../src/templateinterfaces/AITemplateConstructor";

import DefaultAIConstructor from "./mapai/DefaultAIConstructor";

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
    moduleData.copyTemplates<AITemplateConstructor<any>>(
    {
      AIController: DefaultAIConstructor
    }, "AITemplateConstructors");
    
    return moduleData;
  }
}

export default defaultAI;
