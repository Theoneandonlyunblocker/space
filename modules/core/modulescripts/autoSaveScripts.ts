import { PartialModuleScriptsWithData } from "core/modules/ModuleScripts";


export const autoSaveScripts: PartialModuleScriptsWithData =
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
          game.save("autosave", false);
        }
      },
    ],
  }
};
