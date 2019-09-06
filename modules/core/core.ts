import {ModuleData} from "core/modules/ModuleData";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";

import {allScripts} from "./modulescripts/allScripts";

import * as moduleInfo from "./moduleInfo.json";


// TODO 2017.07.27 | move core gameplay stuff here
// TODO 2019.08.24 | ^^^ actually just move this shit to core/ (and organize core/ better too)
// but do expose more stuff to module scripts though
export const core: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: "all",
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.scripts.add(allScripts);

    return moduleData;
  },
};
