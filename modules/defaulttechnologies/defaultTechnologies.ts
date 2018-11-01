import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import TechnologyTemplate from "../../src/templateinterfaces/TechnologyTemplate";

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
  needsToBeInitializedBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<TechnologyTemplate>(technologyTemplates, "Technologies");

    return moduleData;
  },
};

export default defaultTechnologies;
