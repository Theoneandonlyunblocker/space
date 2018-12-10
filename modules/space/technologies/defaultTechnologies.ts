import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import technologyTemplates from "./technologyTemplates";


const defaultTechnologies: ModuleFile =
{
  metaData:
  {
    key: "defaultTechnologies",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(technologyTemplates, "Technologies");

    return moduleData;
  },
};

export default defaultTechnologies;
