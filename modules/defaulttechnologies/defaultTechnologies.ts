import TechnologyTemplates from "./TechnologyTemplates";

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {setTechnologyRequirements} from "../../src/setDynamicTemplateProperties";

import TechnologyTemplate from "../../src/templateinterfaces/TechnologyTemplate";

import * as Languages from "../../localization/defaultLanguages";

const defaultTechnologies: ModuleFile =
{
  key: "defaultTechnologies",
  metaData:
  {
    name: "Default technologies",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  constructModule: function(moduleData: ModuleData)
  {
    setTechnologyRequirements(TechnologyTemplates);

    moduleData.copyTemplates<TechnologyTemplate>(TechnologyTemplates, "Technologies");

    return moduleData;
  },
};

export default defaultTechnologies;
