import { PartialCoreScriptsWithData } from "core/src/triggeredscripts/AllCoreScriptsWithData";
import { updateResources } from "./uicomponents/resources/useResources";
import { updateResearchSpeed } from "./uicomponents/technologies/useResearchSpeed";
import { updateIncome } from "./uicomponents/resources/useIncome";


export const triggeredScripts: PartialCoreScriptsWithData =
{
  onPlayerResourcesChange:
  {
    updateResourcesForUi:
    {
      triggerPriority: 0,
      callback: player =>
      {
        updateResources(player);
      },
    },
  },
  onPlayerIncomeChange:
  {
    updateIncomeForUi:
    {
      triggerPriority: 0,
      callback: player =>
      {
        updateIncome(player);
      },
    },
  },
  onPlayerResearchSpeedChange:
  {
    updateResearchSpeedForUi:
    {
      triggerPriority: 0,
      callback: player =>
      {
        updateResearchSpeed(player);
      },
    },
  },
};
