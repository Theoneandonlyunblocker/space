import AttitudeModifierTemplates from "./AttitudeModifierTemplates";

import ModuleFile from "../../src/ModuleFile";
import ModuleData from "../../src/ModuleData";

import AttitudeModifierTemplate from "../../src/templateinterfaces/AttitudeModifierTemplate";

const defaultAttitudeModifiers: ModuleFile =
{
  key: "defaultAttitudeModifiers",
  metaData:
  {
    name: "Default attitude modifiers",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<AttitudeModifierTemplate>(AttitudeModifierTemplates, "AttitudeModifiers");
    
    return moduleData;
  }
}

export default defaultAttitudeModifiers;
