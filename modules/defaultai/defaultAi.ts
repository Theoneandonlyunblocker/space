import * as Languages from "../../localization/defaultLanguages";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import AiTemplateConstructor from "../../src/templateinterfaces/AITemplateConstructor";

import defaultAiConstructor from "./mapai/DefaultAiConstructor";


const defaultAi: ModuleFile =
{
  key: "defaultAi",
  metaData:
  {
    key: "Default AI",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Game,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<AiTemplateConstructor<any>>(
    {
      [defaultAiConstructor.type]: defaultAiConstructor,
    }, "AiTemplateConstructors");

    return moduleData;
  },
};

export default defaultAi;
