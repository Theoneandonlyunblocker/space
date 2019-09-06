import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";

import {technologyTemplates} from "./technologyTemplates";

import * as moduleInfo from "./moduleInfo.json";


export const spaceTechnologies: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(technologyTemplates, "Technologies");

    return moduleData;
  },
};
