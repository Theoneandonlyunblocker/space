import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import AITemplateConstructor from "../../src/templateinterfaces/AITemplateConstructor";

import DefaultAIConstructor from "./mapai/DefaultAIConstructor";

import * as Languages from "../common/defaultLanguages";

const defaultAI: ModuleFile =
{
  key: "defaultAI",
  metaData:
  {
    name: "Default AI",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.game,
  supportedLanguages: [Languages.en],
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<AITemplateConstructor<any>>(
    {
      [DefaultAIConstructor.type]: DefaultAIConstructor,
    }, "AITemplateConstructors");

    return moduleData;
  },
};

export default defaultAI;
