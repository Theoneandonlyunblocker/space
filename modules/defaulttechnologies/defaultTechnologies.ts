import TechnologyTemplates from "./TechnologyTemplates.ts";

import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import TechnologyTemplate from "../../src/templateinterfaces/TechnologyTemplate.d.ts";

const defaultTechnologies: ModuleFile =
{
  key: "defaultTechnologies",
  metaData:
  {
    name: "Default technologies",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<TechnologyTemplate>(TechnologyTemplates, "Technologies");
    
    return moduleData;
  }
}

export default defaultTechnologies;
