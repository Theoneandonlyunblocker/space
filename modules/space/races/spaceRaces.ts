import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {ModuleData} from "../../../src/ModuleData";
import {ModuleFile} from "../../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../../src/ModuleFileInitializationPhase";

import {raceTemplates} from "./raceTemplates";

import * as moduleInfo from "./moduleInfo.json";


export const spaceRaces: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(raceTemplates, "Races");

    return moduleData;
  },
};
