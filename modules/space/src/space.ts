import {GameModule} from "core/src/modules/GameModule";
import {joinObjectValues} from "core/src/generic/utility";
import { ValuesByGameModuleInitializationPhase, GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { AssetLoadingFunction } from "core/src/modules/AssetLoadingFunction";

import { englishLanguage } from "modules/englishlanguage/src/englishLanguage";
import {unitArchetypes} from "modules/common/unitArchetypes";

import {ruleSet} from "./ruleSet";

import * as abilityTemplates from  "./abilities/abilities";
import {drawNebula} from "./backgrounds/drawNebula";
import * as battleVfxTemplates from  "./battlevfx/templates/battleVfx";
import {buildingTemplates} from "./buildings/buildingTemplates";
import * as passiveSkillTemplates from  "./passiveskills/passiveSkills";
import * as terrainTemplates from  "./terrains/terrains";
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
import {spaceMapModesInitializers} from "./mapmodes/spaceMapModesInitializers";
import {spaceUnitsInitializers} from "./units/spaceUnitsInitializers";

import { setBaseUrl as setAssetBaseUrl } from "../assets/baseUrl";
import * as moduleInfo from "../moduleInfo.json";
import { combatEffectTemplates } from "./combat/combatEffectTemplates";


export const space: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders: joinObjectValues<Partial<ValuesByGameModuleInitializationPhase<AssetLoadingFunction>>>(
    spaceBattleVfxInitializers,
    spaceBuildingsInitializers,
    spaceMapModesInitializers,
    spaceUnitsInitializers,
    {
      [GameModuleInitializationPhase.MapGen]: (baseUrl) =>
      {
        setAssetBaseUrl(baseUrl);

        return Promise.resolve();
      }
    }
  ),
  addToModuleData: moduleData =>
  {
    moduleData.copyTemplates(abilityTemplates, "abilities");
    moduleData.copyTemplates(battleVfxTemplates, "battleVfx");
    moduleData.copyTemplates(buildingTemplates, "buildings");
    moduleData.copyTemplates(combatEffectTemplates, "combatEffects");
    moduleData.copyTemplates(itemTemplates, "items");
    moduleData.copyTemplates(mapGenTemplates, "mapGen");
    moduleData.copyTemplates(mapLayerTemplates, "mapRendererLayers");
    moduleData.copyTemplates(mapModeTemplates, "mapRendererMapModes");
    moduleData.copyTemplates(passiveSkillTemplates, "passiveSkills");
    moduleData.copyTemplates(raceTemplates, "races");
    moduleData.copyTemplates(resourceTemplates, "resources");
    moduleData.copyTemplates(technologyTemplates, "technologies");
    moduleData.copyTemplates(terrainTemplates, "terrains");
    moduleData.copyTemplates(unitArchetypes, "unitArchetypes");
    moduleData.copyTemplates(unitTemplates, "units");

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

    const titansModuleIsLoaded = Boolean(moduleData.nonCoreData.titans);
    if (titansModuleIsLoaded)
    {
      return Promise.all(
      [
        import("./titancomponents/titanComponentTemplates"),
        import("modules/titans/src/nonCoreModuleData"),
      ]).then(loadedModules =>
      {
        const [templatesModule, titansModuleDataModule] = loadedModules;

        titansModuleDataModule.addTitanComponentsToModuleData(
          moduleData,
          templatesModule.titanComponentTemplates,
        );
      });
    }

    return null;
  }
};
