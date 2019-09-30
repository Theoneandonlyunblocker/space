import { PartialTriggeredScriptsWithData } from "core/src/triggeredscripts/TriggeredScripts";
import { updateResources } from "./uicomponents/resources/useResources";


export const triggeredScripts: PartialTriggeredScriptsWithData =
{
  player:
  {
    onResourcesChange:
    {
      updateResourcesForUi:
      {
        triggerPriority: 0,
        script: player =>
        {
          updateResources(player);
        },
      },
    },
  }
};
