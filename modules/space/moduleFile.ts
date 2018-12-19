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

import spaceBackgrounds from "./backgrounds/spaceBackgrounds";
import spaceBuildings from "./buildings/spaceBuildings";
import spaceItems from "./items/spaceItems";
import spaceMapgen from "./mapgen/spaceMapgen";
import spaceMapmodes from "./mapmodes/spaceMapmodes";
import spaceRaces from "./races/spaceRaces";
import spaceTechnologies from "./technologies/spaceTechnologies";
import spaceUnits from "./units/spaceUnits";

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
    spaceBackgrounds,
    spaceBuildings,
    spaceItems,
    spaceMapgen,
    spaceMapmodes,
    spaceRaces,
    spaceTechnologies,
    spaceUnits,
  ],
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
