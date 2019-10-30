import { PartialTriggeredScriptsWithData } from "core/src/triggeredscripts/TriggeredScripts";
import { updateResources } from "./uicomponents/resources/useResources";
import { updateResearchSpeed } from "./uicomponents/technologies/useResearchSpeed";


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
    onResearchSpeedChange:
    {
      updateResearchSpeedForUi:
      {
        triggerPriority: 0,
        script: player =>
        {
          updateResearchSpeed(player);
        },
      },
    },
  },
};
