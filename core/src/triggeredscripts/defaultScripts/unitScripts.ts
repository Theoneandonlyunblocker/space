import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const unitScripts: PartialTriggeredScriptsWithData =
{
  unit:
  {
    onCapture:
    {
      transferCapturedUnit:
      {
        triggerPriority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.transferToPlayer(newPlayer);
        },
      },
      resetExperience:
      {
        triggerPriority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.experienceForCurrentLevel = 0;
        },
      },
      exhaustUnit:
      {
        triggerPriority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.currentMovePoints = 0;
          unit.offensiveBattlesFoughtThisTurn = Infinity;
        },
      },
    },
  },
};
