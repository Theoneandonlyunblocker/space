import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import technologyTemplates from "./technologyTemplates";

import * as moduleInfo from "./moduleInfo.json";


const spaceTechnologies: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(technologyTemplates, "Technologies");

    return moduleData;
  },
};

export default spaceTechnologies;
