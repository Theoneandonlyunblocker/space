import AttitudeModifierTemplates from "./AttitudeModifierTemplates";

import ModuleFile from "../../src/ModuleFile";
import ModuleData from "../../src/ModuleData";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {setAttitudeModifierOverride} from "../../src/setDynamicTemplateProperties";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.mapGen,
  constructModule: function(moduleData: ModuleData)
  {
    setAttitudeModifierOverride(AttitudeModifierTemplates);
    moduleData.copyTemplates<AttitudeModifierTemplate>(AttitudeModifierTemplates, "AttitudeModifiers");
    
    return moduleData;
  }
}

export default defaultAttitudeModifiers;
