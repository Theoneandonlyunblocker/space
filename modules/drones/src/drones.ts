import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";

import {raceTemplates} from "./raceTemplate";
import {unitTemplates} from "./unitTemplates";
import {battleVfxTemplates} from "./battlevfx/templates";

import * as moduleInfo from "../moduleInfo.json";
import { combatEffectTemplates } from "./combat/combatEffectTemplates";
import { combatAbilityTemplates } from "./combat/combatAbilityTemplates";


export const drones: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.templates.races.copyTemplates(raceTemplates);
    moduleData.templates.units.copyTemplates(unitTemplates);
    moduleData.templates.battleVfx.copyTemplates(battleVfxTemplates);
    moduleData.templates.combatEffects.copyTemplates(combatEffectTemplates);
    moduleData.templates.combatAbilities.copyTemplates(combatAbilityTemplates);

    return moduleData;
  },
};
