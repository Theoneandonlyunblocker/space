import {englishLanguage} from "../englishlanguage/englishLanguage";
import {ModuleData} from "../../src/ModuleData";
import {ModuleFile} from "../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../src/ModuleFileInitializationPhase";

import {abilityTemplates} from "./abilities";
import {raceTemplates} from "./raceTemplate";
import {unitEffectTemplates} from "./unitEffects";
import {unitTemplates} from "./unitTemplates";

import * as moduleInfo from "./moduleInfo.json";


export const drones: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(abilityTemplates, "Abilities");
    moduleData.copyTemplates(raceTemplates, "Races");
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");
    moduleData.copyTemplates(unitTemplates, "Units");

    return moduleData;
  },
};
