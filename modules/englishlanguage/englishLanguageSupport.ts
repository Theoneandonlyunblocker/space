import {GameModule} from "../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../src/modules/GameModuleInitializationPhase";

import {englishLanguage} from "./englishLanguage";

import * as moduleInfo from "./moduleInfo.json";


export const englishLanguageSupport: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.AppInit,
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
