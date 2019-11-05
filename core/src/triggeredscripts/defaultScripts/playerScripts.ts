import { PartialCoreScriptsWithData } from "../AllCoreScriptsWithData";


export const playerScripts: PartialCoreScriptsWithData =
{
  onPlayerResearchSpeedChange:
  {
    capTechnologyPrioritiesToMaxNeeded:
    {
      triggerPriority: 0,
      callback: player =>
      {
        player.playerTechnology.capTechnologyPrioritiesToMaxNeeded();
      },
    },
  },
};
