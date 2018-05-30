import * as Languages from "../../localization/defaultLanguages";
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
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Game,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<AITemplateConstructor<any>>(
    {
      [DefaultAIConstructor.type]: DefaultAIConstructor,
    }, "AITemplateConstructors");

    return moduleData;
  },
};

export default defaultAI;
