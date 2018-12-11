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

import defaultBackgrounds from "./backgrounds/defaultBackgrounds";
import defaultBuildings from "./buildings/defaultBuildings";
import defaultItems from "./items/defaultItems";
import defaultMapgen from "./mapgen/defaultMapgen";
import defaultMapmodes from "./mapmodes/defaultMapmodes";
import defaultRaces from "./races/defaultRaces";
import defaultTechnologies from "./technologies/defaultTechnologies";
import defaultUnits from "./units/defaultUnits";

export const space: ModuleFile =
{
  info:
  {
    key: "space",
    version: "0.1.0",
    author: "giraluna",
    description: "",
    modsToReplace: ["defaultRuleSet"],
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameSetup,
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
  // TODO 2018.12.10 |
  // initialize: () =>
  // {

  // },
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
