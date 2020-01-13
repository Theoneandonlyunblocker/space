import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";

import {abilityTemplates} from "./abilityTemplates";
import {raceTemplates} from "./raceTemplate";
import {unitEffectTemplates} from "./unitEffects";
import {unitTemplates} from "./unitTemplates";
import * as battleVfxTemplates from "./battlevfx/templates";

import * as moduleInfo from "../moduleInfo.json";


export const drones: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(abilityTemplates, "abilities");
    moduleData.copyTemplates(raceTemplates, "races");
    moduleData.copyTemplates(unitEffectTemplates, "unitEffects");
    moduleData.copyTemplates(unitTemplates, "units");
    moduleData.copyTemplates(battleVfxTemplates, "battleVfx");

    return moduleData;
  },
};
