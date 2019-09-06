import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";
import { englishLanguage } from "modules/englishlanguage/englishLanguage";
import {ruleSet} from "./ruleSet";

import * as AbilityTemplates from  "./abilities/abilities";
import * as PassiveSkillTemplates from  "./passiveskills/passiveSkills";
import * as TerrainTemplates from  "./terrains/terrains";
import {unitEffectTemplates} from  "./uniteffects/unitEffectTemplates";

import * as moduleInfo from "./moduleInfo.json";


export const space: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(AbilityTemplates, "Abilities");
    moduleData.copyTemplates(PassiveSkillTemplates, "PassiveSkills");
    moduleData.copyTemplates(TerrainTemplates, "Terrains");
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");

    moduleData.ruleSet = ruleSet;
  }
};
