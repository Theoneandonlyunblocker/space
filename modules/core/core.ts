import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import * as Languages from "../../localization/defaultLanguages";

import {allScripts} from "./modulescripts/allScripts";

// TODO 2017.07.27 | move core gameplay stuff here
const core: ModuleFile =
{
  key: "core",
  metaData:
  {
    name: "core",
    version: "0.1.0",
    author: "giraluna",
    description: "Core gameplay functionality",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.setup,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.scripts.add(allScripts);

    return moduleData;
  },
};

export default core;
