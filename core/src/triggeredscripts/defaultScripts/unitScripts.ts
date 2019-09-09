import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const unitScripts: PartialTriggeredScriptsWithData =
{
  unit:
  {
    onCapture:
    [
      {
        key: "transferCapturedUnit",
        triggerPriority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.transferToPlayer(newPlayer);
        },
      },
      {
        key: "resetExperience",
        triggerPriority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.experienceForCurrentLevel = 0;
        },
      },
      {
        key: "exhaustUnit",
        triggerPriority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.currentMovePoints = 0;
          unit.offensiveBattlesFoughtThisTurn = Infinity;
        },
      },
    ],
  },
};
