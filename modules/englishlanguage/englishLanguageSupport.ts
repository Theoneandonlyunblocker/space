import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Init,
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
