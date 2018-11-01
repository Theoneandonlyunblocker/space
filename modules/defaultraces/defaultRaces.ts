import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
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
  needsToBeInitializedBefore: ModuleFileInitializationPhase.GameSetup,
  supportedLanguages: [englishLanguage],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates<RaceTemplate>(raceTemplates, "Races");

    return moduleData;
  },
};

export default defaultRaces;
