import {GameModule} from "core/src/modules/GameModule";
import {joinObjectValues} from "core/src/generic/utility";
import { ValuesByGameModuleInitializationPhase, GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { AssetLoadingFunction } from "core/src/modules/AssetLoadingFunction";

import { englishLanguage } from "modules/englishlanguage/src/englishLanguage";
import {unitArchetypes} from "modules/baselib/src/unitArchetypes";

import {ruleSet} from "./ruleSet";

import {drawNebula} from "./backgrounds/drawNebula";
import {battleVfxTemplates} from  "./battlevfx/templates/battleVfx";
import {buildingTemplates} from "./buildings/buildingTemplates";
import {passiveSkillTemplates} from  "./passiveskills/passiveSkills";
import {terrainTemplates} from  "./terrains/terrains";
import {itemTemplates} from "./items/itemTemplates";
import {mapGenTemplates} from "./mapgen/mapGenTemplates";
import {mapLayerTemplates} from "./mapmodes/mapLayerTemplates";
import {mapModeTemplates} from "./mapmodes/mapModeTemplates";
import {raceTemplates} from "./races/raceTemplates";
import {resourceTemplates} from "./resources/resourceTemplates";
import {technologyTemplates} from "./technologies/technologyTemplates";
import {unitTemplates} from "./units/unitTemplates";

import {spaceBattleVfxInitializers} from "./battlevfx/spaceBattleVfxInitializers";
import {spaceBuildingsInitializers} from "./buildings/spaceBuildingsInitializers";
import {spaceMapModesInitializers} from "./mapmodes/spaceMapModesInitializers";
import {spaceUnitsInitializers} from "./units/spaceUnitsInitializers";

import { setBaseUrl as setAssetBaseUrl } from "../assets/baseUrl";
import * as moduleInfo from "../moduleInfo.json";
import { combatEffectTemplates } from "./combat/combatEffectTemplates";
import { combatAbilityTemplates } from "./combat/combatAbilityTemplates";
import * as semver from "core/src/generic/versions";
import * as debug from "core/src/app/debug";
import {baseLib} from "modules/baselib/src/baseLib";


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
    moduleData.templates.battleVfx.copyTemplates(battleVfxTemplates);
    moduleData.templates.buildings.copyTemplates(buildingTemplates);
    moduleData.templates.combatAbilities.copyTemplates(combatAbilityTemplates);
    moduleData.templates.combatEffects.copyTemplates(combatEffectTemplates);
    moduleData.templates.items.copyTemplates(itemTemplates);
    moduleData.templates.mapGen.copyTemplates(mapGenTemplates);
    moduleData.templates.mapRendererLayers.copyTemplates(mapLayerTemplates);
    moduleData.templates.mapRendererMapModes.copyTemplates(mapModeTemplates);
    moduleData.templates.passiveSkills.copyTemplates(passiveSkillTemplates);
    moduleData.templates.races.copyTemplates(raceTemplates);
    moduleData.templates.resources.copyTemplates(resourceTemplates);
    moduleData.templates.technologies.copyTemplates(technologyTemplates);
    moduleData.templates.terrains.copyTemplates(terrainTemplates);
    moduleData.templates.unitArchetypes.copyTemplates(unitArchetypes);
    moduleData.templates.units.copyTemplates(unitTemplates);

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
  },
  reviveGameData: (saveData) =>
  {
    const dataVersion = saveData.appVersion;
    if (semver.lt(dataVersion, "0.6.0"))
    {
      debug.log("saves", `Executing stored core save data reviver 'addBaseLibToSaveData'`);
      addBaseLibToSaveData();

      debug.log("saves", `Executing stored core save data reviver 'remapStandByToStandby'`);
      remapStandByToStandby();
    }

    function addBaseLibToSaveData()
    {
      saveData.moduleData.baseLib =
      {
        info: baseLib.info,
        moduleSaveData: null,
      };
    }
    function remapStandByToStandby()
    {
      const remappedAbilityKeys =
      {
        standBy: "standby",
      };

      saveData.gameData.units.forEach((unitSaveData: any) =>
      {
        unitSaveData.abilityTypes = unitSaveData.abilityTypes.map((key: string) =>
        {
          if (remappedAbilityKeys[key])
          {
            return remappedAbilityKeys[key];
          }
          else
          {
            return key;
          }
        });
      });
    }
  },
};
