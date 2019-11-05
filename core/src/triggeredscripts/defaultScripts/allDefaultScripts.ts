import { autoSaveScripts } from "./autoSaveScripts";
import { playerScripts } from "./playerScripts";
import { starScripts } from "./starScripts";
import { unitScripts } from "./unitScripts";
import { PartialCoreScriptsWithData } from "../AllCoreScriptsWithData";


export const allDefaultScripts: PartialCoreScriptsWithData =
{
  ...autoSaveScripts,
  ...playerScripts,
  ...starScripts,
  ...unitScripts,
};
