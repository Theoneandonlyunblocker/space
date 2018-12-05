import { PartialModuleScriptsWithData } from "../../../src/ModuleScripts";


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
