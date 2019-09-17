import {GameModule} from "core/src/modules/GameModule";
import {joinObjectValues} from "core/src/generic/utility";
import { englishLanguage } from "modules/englishlanguage/src/englishLanguage";
import {ruleSet} from "./ruleSet";

import * as abilityTemplates from  "./abilities/abilities";
import {drawNebula} from "./backgrounds/drawNebula";
import * as battleVfxTemplates from  "./battlevfx/templates/battleVfx";
import {buildingTemplates} from "./buildings/buildingTemplates";
import * as passiveSkillTemplates from  "./passiveskills/passiveSkills";
import * as terrainTemplates from  "./terrains/terrains";
import {unitEffectTemplates} from  "./uniteffects/unitEffectTemplates";
import {itemTemplates} from "./items/itemTemplates";
import {mapGenTemplates} from "./mapgen/mapGenTemplates";
import {mapLayerTemplates} from "./mapmodes/mapLayerTemplates";
import {mapModeTemplates} from "./mapmodes/mapModeTemplates";
import {raceTemplates} from "./races/raceTemplates";
import * as resourceTemplates from "./resources/resourceTemplates";
import {technologyTemplates} from "./technologies/technologyTemplates";
import {unitTemplates} from "./units/unitTemplates";

import {spaceBattleVfxInitializers} from "./battlevfx/spaceBattleVfxInitializers";
import {spaceBuildingsInitializers} from "./buildings/spaceBuildingsInitializers";
import {spaceItemsInitializers} from "./items/spaceItemsInitializers";
import {spaceMapModesInitializers} from "./mapmodes/spaceMapModesInitializers";
import {spaceResourcesInitializers} from "./resources/spaceResourcesInitializers";
import {spaceUnitsInitializers} from "./units/spaceUnitsInitializers";

import {unitArchetypes} from "modules/common/unitArchetypes";

import * as moduleInfo from "../moduleInfo.json";
import { ValuesByGameModuleInitializationPhase, GameModuleAssetLoader } from "core/src/modules/GameModuleInitialization";


export const space: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders: joinObjectValues<Partial<ValuesByGameModuleInitializationPhase<GameModuleAssetLoader>>>(
    spaceBattleVfxInitializers,
    spaceBuildingsInitializers,
    spaceItemsInitializers,
    spaceMapModesInitializers,
    spaceResourcesInitializers,
    spaceUnitsInitializers,
  ),
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(abilityTemplates, "Abilities");
    moduleData.copyTemplates(battleVfxTemplates, "BattleVfx");
    moduleData.copyTemplates(buildingTemplates, "Buildings");
    moduleData.copyTemplates(itemTemplates, "Items");
    moduleData.copyTemplates(mapGenTemplates, "MapGen");
    moduleData.copyTemplates(mapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates(mapModeTemplates, "MapRendererMapModes");
    moduleData.copyTemplates(passiveSkillTemplates, "PassiveSkills");
    moduleData.copyTemplates(raceTemplates, "Races");
    moduleData.copyTemplates(resourceTemplates, "Resources");
    moduleData.copyTemplates(technologyTemplates, "Technologies");
    moduleData.copyTemplates(terrainTemplates, "Terrains");
    moduleData.copyTemplates(unitArchetypes, "UnitArchetypes");
    moduleData.copyTemplates(unitEffectTemplates, "UnitEffects");
    moduleData.copyTemplates(unitTemplates, "Units");

    if (!moduleData.mapBackgroundDrawingFunction)
    {
      moduleData.mapBackgroundDrawingFunction = drawNebula;
    }
    if (!moduleData.starBackgroundDrawingFunction)
    {
      moduleData.starBackgroundDrawingFunction = drawNebula;
    }

    if (!moduleData.defaultMap)
    {
      moduleData.defaultMap = mapGenTemplates.spiralGalaxy;
    }

    moduleData.ruleSet = ruleSet;
  }
};
