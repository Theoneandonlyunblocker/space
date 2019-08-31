import {unitScripts} from "./unitScripts";
import {starScripts} from "./starScripts";
import {autoSaveScripts} from "./autoSaveScripts";
import { PartialModuleScriptsWithData } from "../../../src/modules/ModuleScripts";

const scriptsToMerge: PartialModuleScriptsWithData[] =
[
  starScripts,
  unitScripts,
  autoSaveScripts,
];

export const allScripts: PartialModuleScriptsWithData = scriptsToMerge.reduce((
  merged: PartialModuleScriptsWithData,
  toMerge: PartialModuleScriptsWithData,
) =>
{
  for (const category in toMerge)
  {
    if (!merged[category])
    {
      merged[category] = {};
    }

    for (const scriptType in toMerge[category])
    {
      if (!merged[category][scriptType])
      {
        merged[category][scriptType] = [];
      }

      merged[category][scriptType].push(...toMerge[category][scriptType]);
    }
  }

  return merged;
}, {});
