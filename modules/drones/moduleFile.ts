import * as PIXI from "pixi.js";

import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";

import {abilityTemplates} from "./abilities";
import {raceTemplates} from "./raceTemplate";
import {unitEffectTemplates} from "./unitEffects";
import {unitTemplates} from "./unitTemplates";


export const drones: ModuleFile =
{
  info:
  {
    key: "drones",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
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
