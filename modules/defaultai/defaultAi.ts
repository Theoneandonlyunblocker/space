import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";

import defaultAiConstructor from "./mapai/DefaultAiConstructor";
import {attachedUnitDataScripts} from "./attachedUnitData";


const defaultAi: ModuleFile =
{
  metaData:
  {
    key: "defaultAi",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(
    {
      [defaultAiConstructor.type]: defaultAiConstructor,
    }, "AiTemplateConstructors");

    moduleData.scripts.add(attachedUnitDataScripts);

    return moduleData;
  },
};

export default defaultAi;
