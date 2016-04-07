import AttitudeModifierTemplates from "./AttitudeModifierTemplates.ts";

import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import AttitudeModifierTemplate from "../../src/templateinterfaces/AttitudeModifierTemplate.d.ts";

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
    moduleData.copyTemplates<AttitudeModifierTemplate>(AttitudeModifierTemplates, "AttitudeModifierTemplates");
    
    return moduleData;
  }
}

export default defaultAttitudeModifiers;
