import {ModuleData} from "../../src/ModuleData";
import {GameModule} from "../../src/GameModule";
import {GameModuleInitializationPhase} from "../../src/GameModuleInitializationPhase";

import {allScripts} from "./modulescripts/allScripts";

import * as moduleInfo from "./moduleInfo.json";


// TODO 2017.07.27 | move core gameplay stuff here
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
