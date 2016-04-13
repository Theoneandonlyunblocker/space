import TechnologyTemplates from "./TechnologyTemplates";

import ModuleFile from "../../src/ModuleFile";
import ModuleData from "../../src/ModuleData";

import TechnologyTemplate from "../../src/templateinterfaces/TechnologyTemplate";

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
