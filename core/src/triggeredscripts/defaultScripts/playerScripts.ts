import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const playerScripts: PartialTriggeredScriptsWithData =
{
  player:
  {
    onResearchSpeedChange:
    {
      capTechnologyPrioritiesToMaxNeeded:
      {
        triggerPriority: 0,
        script: player =>
        {
          player.playerTechnology.capTechnologyPrioritiesToMaxNeeded();
        },
      },
    },
  },
};
