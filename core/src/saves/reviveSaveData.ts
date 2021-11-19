// for core data only (everything under /src)
// modules should handle save compability on their own, but are free to use the stuff in here

import {app} from "../app/App"; // TODO global
import {FullSaveData} from "../savedata/FullSaveData";
import * as semver from "../generic/versions";
import * as debug from "../app/debug";
import { flatten2dArray, getFunctionName } from "../generic/utility";
import {activeModuleStore} from "../modules/ModuleStore";
import { ModuleSaveData } from "core/src/modules/GameModule";
import { AttitudeModifierSaveData } from "../savedata/AttitudeModifierSaveData";


// data is cloned at start of reviving process
// all revivers act on the same cloned data and are destructive
type Reviver<T extends any[] = any[]> = (...args: T) => void;

export type ReviversByVersion =
{
  [version: string]: Reviver[];
};

export type OutdatedFullSaveData = FullSaveData; // useful to keep them nominally distinct

export function fetchNeededReviversForData(
  dataVersion: string,
  liveVersion: string,
  revivers: ReviversByVersion,
): Reviver[]
{
  const neededRevivers: Reviver[] = [];

  Object.keys(revivers).sort(semver.compare).filter(reviverDataVersion =>
  {
    // save was made before versions were attached to savedata
    if (!dataVersion)
    {
      return true;
    }

    return semver.gte(reviverDataVersion, dataVersion) && semver.lt(reviverDataVersion, liveVersion);
  }).forEach(reviverVersion =>
  {
    neededRevivers.push(...revivers[reviverVersion]);
  });

  return neededRevivers;
}
export function reviveSaveData(data: OutdatedFullSaveData, liveAppVersion: string): Promise<FullSaveData>
{
  const clonedData = {...data};

  return new Promise(resolve =>
  {
    reviveCoreSaveData(clonedData, liveAppVersion);
    reviveModuleSaveData(clonedData).then(() =>
    {
      resolve(clonedData);
    });
  });
}

const coreSaveDataRevivers: ReviversByVersion =
{
  "0.0.0":
  [
    function setAppVersion(saveData)
    {
      saveData.appVersion = "0.0.0";
    },
    function addDummyModuleData(saveData)
    {
      saveData.moduleData = app.initialModules.map(moduleInfo =>
      {
        return(
        {
          metaData: {...moduleInfo, version: "0.0.0"},
          moduleSaveData: {},
        });
      });
    },
  ],
  "0.1.0":
  [
    function renameUnitSaveDataAbilityKeys(saveData)
    {
      saveData.gameData.units.forEach((unitData: any) =>
      {
        unitData.abilityTypes = unitData.abilityTemplateTypes;
        unitData.passiveSkillTypes = unitData.passiveSkillTemplateTypes;
      });
    },
  ],
  "0.2.0":
  [
    // not actually needed as we should just use more recent ModuleInfo anyway
    function renameModuleMetaDataToModuleInfo(saveData)
    {
      saveData.moduleData.forEach((moduleSaveData: any) =>
      {
        moduleSaveData.info = moduleSaveData.metaData;
      });
    },
  ],
  "0.3.0":
  [
    // not actually needed as we should just use more recent ModuleInfo anyway
    function remapModuleInfoKeys(saveData)
    {
      saveData.moduleData.forEach((moduleSaveData: any) =>
      {
        moduleSaveData.info.gameModuleVariableName = moduleSaveData.info.moduleFileVariableName;
        moduleSaveData.info.moduleBundleUrl = moduleSaveData.info.moduleFileUrl;
      });
    }
  ],
  "0.4.0":
  [
    function removeCoreModuleSaveData(saveData)
    {
      const moduleDataWithoutCoreModule = saveData.moduleData.filter((moduleSaveData: ModuleSaveData) =>
      {
        const isCoreModule = moduleSaveData.info.key === "core";

        return !isCoreModule;
      });

      saveData.moduleData = moduleDataWithoutCoreModule;
    }
  ],
  "0.5.2":
  [
    function convertModuleSaveDataToObject(saveData)
    {
      saveData.moduleData = saveData.moduleData.reduce(
      (
        converted: {[moduleKey: string]: ModuleSaveData},
        moduleData: ModuleSaveData,
      ) =>
      {
        const key = moduleData.info.key;
        converted[key] = moduleData;

        return converted;
      }, {});
    }
  ],
  "0.5.3":
  [
    function changeStatusEffectsToCombatEffects(saveData)
    {
      saveData.gameData.units.forEach((unitSaveData: any) =>
      {
        unitSaveData.battleStats.combatEffects =
        {
          effects: [...unitSaveData.battleStats.statusEffects],
        };
      });
    }
  ],
  "0.6.0":
  [
    // easier to read and should be implicit anyway
    // ie templateType => template
    function removeSuffix_Type_FromSaveDataKeys(saveData: OutdatedFullSaveData)
    {
      const units = saveData.gameData.units;
      const buildings = saveData.gameData.galaxyMap.stars.map(star => star.buildings);
      const aiControllers = saveData.gameData.players.filter(player =>
      {
        return Boolean(player.AiController);
      }).map(player =>
      {
        return player.AiController;
      });
      const attitudeModifiers = saveData.gameData.players.filter(player =>
      {
        return Boolean(player.diplomacyData);
      }).map(player =>
      {
        const modifiersByPlayer = player.diplomacyData.attitudeModifiersByPlayer;

        return Object.keys(modifiersByPlayer).reduce((allModifiers: AttitudeModifierSaveData[], playerId) =>
        {
          const modifiersForPlayer = modifiersByPlayer[playerId];

          return [...allModifiers, ...modifiersForPlayer];
        }, []);
      });
      const items = saveData.gameData.items;

      [
        ...units,
        ...aiControllers,
        ...flatten2dArray(buildings),
        ...flatten2dArray(attitudeModifiers),
        ...items,
      ].forEach((thingWithTemplateType: any) =>
      {
        thingWithTemplateType.template = thingWithTemplateType.templateType;
      });

      saveData.gameData.galaxyMap.stars.forEach((star: any) =>
      {
        star.resource = star.resourceType;
        star.race = star.raceType;
        star.terrain = star.terrainType;
      });

      saveData.gameData.units.forEach((unit: any) =>
      {
        unit.abilities = unit.abilityTypes;
        unit.passiveSkills = unit.passiveSkillTypes;
      });
    },

    // easier to read and should be implicit anyway
    // ie portraitKey => portrait
    function removeSuffix_Key_FromSaveDataKeys(saveData: OutdatedFullSaveData)
    {
      saveData.gameData.units.forEach((unit: any) =>
      {
        unit.portrait = unit.portraitKey;
        unit.race = unit.raceKey;
      });

      saveData.gameData.players.forEach((player: any) =>
      {
        player.race = player.raceKey;
      });

      saveData.gameData.players.forEach((player: any) =>
      {
        player.flag.emblems.forEach((emblem: any) =>
        {
          emblem.template = emblem.templateKey;
        });
      });

      saveData.gameData.units.forEach((unit: any) =>
      {
        if (unit.battleStats.queuedAction)
        {
          unit.battleStats.queuedAction.ability =
            unit.battleStats.queuedAction.abilityTemplateKey;
        }
      });

      saveData.gameData.notificationStore.notifications.forEach((notification: any) =>
      {
        notification.template = notification.templateKey;
      });
    },
  ],
};

function reviveModuleSaveData(data: OutdatedFullSaveData): Promise<void>
{
  return new Promise(resolve =>
  {
    const modulesInData = Object.keys(data.moduleData).map(moduleKey => data.moduleData[moduleKey].info);

    activeModuleStore.getModules(...modulesInData).then(gameModules =>
    {
      gameModules.forEach(gameModule =>
      {
        if (gameModule.reviveGameData)
        {
          gameModule.reviveGameData(data);
        }
      });
    }).then(resolve);
  });
}
function reviveCoreSaveData(data: OutdatedFullSaveData, liveAppVersion: string): void
{
  const reviversToExecute = fetchNeededReviversForData(
    data.appVersion,
    liveAppVersion,
    coreSaveDataRevivers,
  );

  reviversToExecute.forEach(reviverFN =>
  {
    debug.log("saves", `Executing stored core save data reviver function '${getFunctionName(reviverFN)}'`);
    reviverFN(data);
  });
}
