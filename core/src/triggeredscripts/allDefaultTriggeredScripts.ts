import {unitScripts} from "./defaultScripts/unitScripts";
import {starScripts} from "./defaultScripts/starScripts";
import {autoSaveScripts} from "./defaultScripts/autoSaveScripts";
import { PartialTriggeredScriptsWithData } from "./TriggeredScripts";


const scriptsToMerge: PartialTriggeredScriptsWithData[] =
[
  starScripts,
  unitScripts,
  autoSaveScripts,
];

export const allDefaultTriggeredScripts: PartialTriggeredScriptsWithData = scriptsToMerge.reduce((
  merged: PartialTriggeredScriptsWithData,
  toMerge: PartialTriggeredScriptsWithData,
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
