import { PartialCoreScriptsWithData } from "../AllCoreScriptsWithData";


export const autoSaveScripts: PartialCoreScriptsWithData =
{
  beforePlayerTurnEnd:
  {
    autoSaveBeforePlayerTurnEnd:
    {
      triggerPriority: 0,
      callback: (game) =>
      {
        const wasManuallyTriggered = false;
        game.save("autosave", wasManuallyTriggered);
      }
    },
  },
};
