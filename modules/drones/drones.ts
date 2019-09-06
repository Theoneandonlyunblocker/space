import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {ModuleData} from "src/modules/ModuleData";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

import {abilityTemplates} from "./abilityTemplates";
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
