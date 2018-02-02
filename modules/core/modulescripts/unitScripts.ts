import {ScriptsWithData} from "../../../src/ModuleScriptData";

import {UnitScripts} from "../../../src/modulescriptinterfaces/UnitScripts";


export const unitScripts: Partial<ScriptsWithData<UnitScripts>> =
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
};
