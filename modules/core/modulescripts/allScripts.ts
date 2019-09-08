import {unitScripts} from "./unitScripts";
import {starScripts} from "./starScripts";
import {autoSaveScripts} from "./autoSaveScripts";
import { PartialTriggeredScriptsWithData } from "core/triggeredscripts/TriggeredScripts";

const scriptsToMerge: PartialTriggeredScriptsWithData[] =
[
  starScripts,
  unitScripts,
  autoSaveScripts,
];

export const allScripts: PartialTriggeredScriptsWithData = scriptsToMerge.reduce((
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
