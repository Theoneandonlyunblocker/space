// for core data only (everything under /src)
// modules should handle save compability on their own

import FullSaveData from "./savedata/FullSaveData";
import * as semver from "./versions";
import * as debug from "./debug";
import { getFunctionName } from "./utility";
import {activeModuleStore} from "./ModuleStore";
import { defaultModules } from "./defaultModules";


// data is cloned at start of reviving process
// all revivers act on the same cloned data and are destructive
type Reviver<T extends any[] = any[]> = (...args: T) => void;

export type ReviversByVersion =
{
  [version: string]: Reviver[];
};

export function fetchNeededReviversForData(
  dataVersion: string,
  liveVersion: string,
  revivers: ReviversByVersion,
): Reviver[]
{
  const neededRevivers: Reviver[] = [];

  Object.keys(revivers).sort(semver.compare).reverse().filter(reviverDataVersion =>
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

type OutdatedFullSaveData = FullSaveData; // useful to keep them nominally distinct

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
      saveData.moduleData = defaultModules.map(module =>
      {
        return(
        {
          metaData: {...module.metaData, version: "0.0.0"},
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
};

function reviveModuleSaveData(data: OutdatedFullSaveData): Promise<void[]>
{
  return Promise.all(data.moduleData.map(moduleData =>
  {
    return activeModuleStore.load(moduleData.metaData).then(moduleFile =>
    {
      if (moduleFile.reviveGameSpecificData)
      {
        moduleFile.reviveGameSpecificData(moduleData);
      }
    });
  }));
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
