import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import { englishLanguage } from "../englishlanguage/englishLanguage";
import {ruleSet} from "./ruleSet";

import * as AbilityTemplates from  "./abilities/abilities";
import * as BattleSfxTemplates from  "./battlesfx/templates/battleSfx";
import * as PassiveSkillTemplates from  "./passiveskills/passiveSkills";
import * as ResourceTemplates from  "./resources/resources";
import * as TerrainTemplates from  "./terrains/terrains";
import {unitEffectTemplates} from  "./uniteffects/unitEffectTemplates";

export const space: ModuleFile =
{
  metaData:
  {
    key: "space",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  subModules:
  [
    defaultBackgrounds,
    defaultBuildings,
    defaultItems,
    defaultMapgen,
    defaultMapmodes,
    defaultRaces,
    defaultTechnologies,
    defaultUnits,
  ],
  initialize: onLoaded =>
  {

  },
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(AbilityTemplates, "Abilities");
    moduleData.copyTemplates(ResourceTemplates, "Resources");
    moduleData.copyTemplates(BattleSfxTemplates, "BattleSfx");
    moduleData.copyTemplates(PassiveSkillTemplates, "PassiveSkills");
    moduleData.copyTemplates(TerrainTemplates, "Terrains");
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");

    moduleData.ruleSet = ruleSet;
  }
};
