import { PartialTriggeredScriptsWithData } from "core/triggeredscripts/TriggeredScripts";


export const autoSaveScripts: PartialTriggeredScriptsWithData =
{
  game:
  {
    beforePlayerTurnEnd:
    [
      {
        key: "autoSaveBeforePlayerTurnEnd",
        priority: 0,
        script: (game) =>
        {
          const wasManuallyTriggered = false;
          game.save("autosave", wasManuallyTriggered);
        }
      },
    ],
  }
};
