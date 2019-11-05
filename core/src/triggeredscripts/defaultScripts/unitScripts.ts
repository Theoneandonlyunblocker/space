import { PartialCoreScriptsWithData } from "../AllCoreScriptsWithData";


export const unitScripts: PartialCoreScriptsWithData =
{
  onUnitCapture:
  {
    transferCapturedUnit:
    {
      triggerPriority: 0,
      callback: (unit, oldPlayer, newPlayer) =>
      {
        unit.transferToPlayer(newPlayer);
      },
    },
    resetExperience:
    {
      triggerPriority: 0,
      callback: (unit, oldPlayer, newPlayer) =>
      {
        unit.experienceForCurrentLevel = 0;
      },
    },
    exhaustUnit:
    {
      triggerPriority: 0,
      callback: (unit, oldPlayer, newPlayer) =>
      {
        unit.currentMovePoints = 0;
        unit.offensiveBattlesFoughtThisTurn = Infinity;
      },
    },
  },
};
