import {englishLanguage} from "../englishlanguage/englishLanguage";
import {ModuleData} from "../../src/ModuleData";
import {GameModule} from "../../src/GameModule";
import {GameModuleInitializationPhase} from "../../src/GameModuleInitializationPhase";

import {abilityTemplates} from "./abilities";
import {raceTemplates} from "./raceTemplate";
import {unitEffectTemplates} from "./unitEffects";
import {unitTemplates} from "./unitTemplates";
import * as battleVfxTemplates from "./battlevfx/templates";

import * as moduleInfo from "./moduleInfo.json";


export const drones: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(abilityTemplates, "Abilities");
    moduleData.copyTemplates(raceTemplates, "Races");
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");
    moduleData.copyTemplates(unitTemplates, "Units");
    moduleData.copyTemplates(battleVfxTemplates, "BattleVfx");

    return moduleData;
  },
};
