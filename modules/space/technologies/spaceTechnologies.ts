import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

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
