import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const autoSaveScripts: PartialTriggeredScriptsWithData =
{
  game:
  {
    beforePlayerTurnEnd:
    {
      autoSaveBeforePlayerTurnEnd:
      {
        triggerPriority: 0,
        script: (game) =>
        {
          const wasManuallyTriggered = false;
          game.save("autosave", wasManuallyTriggered);
        }
      },
    },
  }
};
