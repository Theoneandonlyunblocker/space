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
  needsToBeInitializedBefore: ModuleFileInitializationPhase.Init,
  supportedLanguages: "all",
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates(
    {
      en: englishLanguage,
    }, "Languages");

    return moduleData;
  },
};
