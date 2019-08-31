import {GameModule} from "../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../src/modules/GameModuleInitializationPhase";
import { englishLanguage } from "../englishlanguage/englishLanguage";
import {ruleSet} from "./ruleSet";

import * as AbilityTemplates from  "./abilities/abilities";
import * as PassiveSkillTemplates from  "./passiveskills/passiveSkills";
import * as TerrainTemplates from  "./terrains/terrains";
import {unitEffectTemplates} from  "./uniteffects/unitEffectTemplates";

import {spaceBackgrounds} from "./backgrounds/spaceBackgrounds";
import {spaceBattleVfx} from "./battlevfx/spaceBattleVfx";
import {spaceBuildings} from "./buildings/spaceBuildings";
import {spaceItems} from "./items/spaceItems";
import {spaceMapGen} from "./mapgen/spaceMapGen";
import {spaceMapModes} from "./mapmodes/spaceMapModes";
import {spaceRaces} from "./races/spaceRaces";
import {spaceTechnologies} from "./technologies/spaceTechnologies";
import {spaceUnits} from "./units/spaceUnits";
import {spaceResources} from "./resources/spaceResources";

import * as moduleInfo from "./moduleInfo.json";


export const space: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  subModules:
  [
    spaceBackgrounds,
    spaceBattleVfx,
    spaceBuildings,
    spaceItems,
    spaceMapGen,
    spaceMapModes,
    spaceRaces,
    spaceTechnologies,
    spaceUnits,
    spaceResources,
  ],
  // initialize: baseUrl =>
  // {

  // },
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(AbilityTemplates, "Abilities");
    moduleData.copyTemplates(PassiveSkillTemplates, "PassiveSkills");
    moduleData.copyTemplates(TerrainTemplates, "Terrains");
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");

    moduleData.ruleSet = ruleSet;
  }
};
