import { TriggeredScriptCollection } from "core/src/triggeredscripts/TriggeredScriptCollection";
import { Star } from "core/src/map/Star";
import { TriggeredScriptsWithData } from "core/src/triggeredscripts/TriggeredScriptsWithData";
import { updateTitanAssemblingCapacity } from "./uicomponents/useTitanAssemblingCapacity";


export type TriggeredScripts =
{
  onTitanAssemblingCapacityChange: (star: Star) => void;
};

const defaultTriggeredScripts: TriggeredScriptsWithData<TriggeredScripts> =
{
  onTitanAssemblingCapacityChange:
  {
    updateTitanAssemblingCapacityForUi:
    {
      triggerPriority: 0,
      callback: star =>
      {
        updateTitanAssemblingCapacity(star);
      },
    },
  },
};

export const triggeredScripts = new TriggeredScriptCollection<TriggeredScripts>(defaultTriggeredScripts);
