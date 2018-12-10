import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";

import {englishLanguage} from "./englishLanguage";


export const englishLanguageSupport: ModuleFile =
{
  metaData:
  {
    key: "englishLanguageSupport",
    version: "0.1.0",
    author: "giraluna",
    description: "Adds English to the list of available languages",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.AppInit,
  supportedLanguages: "all",
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(
    {
      en: englishLanguage,
    }, "Languages");

    return moduleData;
  },
};
