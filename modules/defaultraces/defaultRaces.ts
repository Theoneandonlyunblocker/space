import RaceTemplates from "./RaceTemplates";

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";

const defaultRaces: ModuleFile =
{
  key: "defaultRaces",
  metaData:
  {
    name: "Default Buildings",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.setup,
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<RaceTemplate>(RaceTemplates, "Races");

    return moduleData;
  }
}

export default defaultRaces;
