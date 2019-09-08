// for core data only (everything under /src)
// modules should handle save compability on their own, but are free to use the stuff in here

import {app} from "../app/App"; // TODO global
import {FullSaveData} from "../savedata/FullSaveData";
import * as semver from "../app/versions";
import * as debug from "../app/debug";
import { getFunctionName } from "../generic/utility";
import {activeModuleStore} from "../modules/ModuleStore";
import { ModuleSaveData } from "core/modules/GameModule";


// data is cloned at start of reviving process
// all revivers act on the same cloned data and are destructive
type Reviver<T extends any[] = any[]> = (...args: T) => void;

export type ReviversByVersion =
{
  [version: string]: Reviver[];
};

type OutdatedFullSaveData = FullSaveData; // useful to keep them nominally distinct

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
};

function reviveModuleSaveData(data: OutdatedFullSaveData): Promise<void>
{
  return new Promise(resolve =>
  {
    const modulesInData = data.moduleData.map(moduleData => moduleData.info);

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
