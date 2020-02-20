import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";

import {abilityTemplates} from "./abilityTemplates";
import {raceTemplates} from "./raceTemplate";
import {unitTemplates} from "./unitTemplates";
import * as battleVfxTemplates from "./battlevfx/templates";

import * as moduleInfo from "../moduleInfo.json";
import { combatEffectTemplates } from "./combat/combatEffectTemplates";
import { combatAbilityTemplates } from "./combat/combatAbilityTemplates";


export const drones: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(abilityTemplates, "abilities");
    moduleData.copyTemplates(raceTemplates, "races");
    moduleData.copyTemplates(unitTemplates, "units");
    moduleData.copyTemplates(battleVfxTemplates, "battleVfx");
    moduleData.copyTemplates(combatEffectTemplates, "combatEffects");
    moduleData.copyTemplates(combatAbilityTemplates, "combatAbilities");

    return moduleData;
  },
};
