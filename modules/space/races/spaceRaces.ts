import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {ModuleData} from "src/modules/ModuleData";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

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
