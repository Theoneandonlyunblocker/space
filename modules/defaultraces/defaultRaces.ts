import * as Languages from "../../localization/defaultLanguages";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";

import raceTemplates from "./RaceTemplates";


const defaultRaces: ModuleFile =
{
  key: "defaultRaces",
  metaData:
  {
    key: "Default Races",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates<RaceTemplate>(raceTemplates, "Races");

    return moduleData;
  },
};

export default defaultRaces;
