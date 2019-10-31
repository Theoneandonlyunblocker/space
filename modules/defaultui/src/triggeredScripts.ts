import { PartialTriggeredScriptsWithData } from "core/src/triggeredscripts/TriggeredScripts";
import { updateResources } from "./uicomponents/resources/useResources";
import { updateResearchSpeed } from "./uicomponents/technologies/useResearchSpeed";
import { updateIncome } from "./uicomponents/resources/useIncome";


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
    onIncomeChange:
    {
      updateIncomeForUi:
      {
        triggerPriority: 0,
        script: player =>
        {
          updateIncome(player);
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
