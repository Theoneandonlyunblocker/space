import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {ModuleData} from "core/modules/ModuleData";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";

import {raceTemplates} from "./raceTemplates";

import * as moduleInfo from "./moduleInfo.json";


export const spaceRaces: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(raceTemplates, "Races");

    return moduleData;
  },
};
