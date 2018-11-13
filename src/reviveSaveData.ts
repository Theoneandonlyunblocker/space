// for core data only (everything under /src)
// modules should handle save compability on their own

import FullSaveData from "./savedata/FullSaveData";
import ModuleFile from "./ModuleFile";
import * as semver from "./versions";
import * as debug from "./debug";
import { getFunctionName } from "./utility";


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
export function reviveSaveData(data: OutdatedFullSaveData, liveAppVersion: string): FullSaveData
{
  const clonedData = {...data};

  reviveCoreSaveData(clonedData, liveAppVersion);
  reviveModuleSaveData(clonedData);

  return clonedData;
}

const coreSaveDataRevivers: ReviversByVersion =
{
  "0.0.0":
  [
    (saveData) =>
    {
      saveData.appVersion = "0.0.0";
    },
  ],
};

function reviveModuleSaveData(data: OutdatedFullSaveData): void
{
  // TODO 2018.10.16 | load module files associated with savedata
  const liveModuleFiles: {[key: string]: ModuleFile} = {};

  data.moduleData.forEach(moduleData =>
  {
    const moduleFile = liveModuleFiles[moduleData.metaData.key];

    return moduleFile.reviveGameSpecificData(moduleData);
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
