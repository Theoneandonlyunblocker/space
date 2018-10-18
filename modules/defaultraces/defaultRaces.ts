import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {RaceTemplate} from "../../src/templateinterfaces/RaceTemplate";

import raceTemplates from "./RaceTemplates";


const defaultRaces: ModuleFile =
{
  metaData:
  {
    key: "defaultRaces",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Setup,
  supportedLanguages: [englishLanguage],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates<RaceTemplate>(raceTemplates, "Races");

    return moduleData;
  },
};

export default defaultRaces;
