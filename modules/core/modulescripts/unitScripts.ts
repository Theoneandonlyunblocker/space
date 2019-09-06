import { PartialModuleScriptsWithData } from "core/modules/ModuleScripts";


export const unitScripts: PartialModuleScriptsWithData =
{
  unit:
  {
    onCapture:
    [
      {
        key: "transferCapturedUnit",
        priority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.transferToPlayer(newPlayer);
        },
      },
      {
        key: "resetExperience",
        priority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.experienceForCurrentLevel = 0;
        },
      },
      {
        key: "exhaustUnit",
        priority: 0,
        script: (unit, oldPlayer, newPlayer) =>
        {
          unit.currentMovePoints = 0;
          unit.offensiveBattlesFoughtThisTurn = Infinity;
        },
      },
    ],
  },
};
