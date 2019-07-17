import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {ModuleData} from "../../../src/ModuleData";
import {GameModule} from "../../../src/GameModule";
import {GameModuleInitializationPhase} from "../../../src/GameModuleInitializationPhase";

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
