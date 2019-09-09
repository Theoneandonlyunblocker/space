import { PartialTriggeredScriptsWithData } from "../TriggeredScripts";


export const autoSaveScripts: PartialTriggeredScriptsWithData =
{
  game:
  {
    beforePlayerTurnEnd:
    [
      {
        key: "autoSaveBeforePlayerTurnEnd",
        triggerPriority: 0,
        script: (game) =>
        {
          const wasManuallyTriggered = false;
          game.save("autosave", wasManuallyTriggered);
        }
      },
    ],
  }
};
