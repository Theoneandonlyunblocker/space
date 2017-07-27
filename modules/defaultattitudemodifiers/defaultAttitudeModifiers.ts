import AttitudeModifierTemplates from "./AttitudeModifierTemplates";

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import {setAttitudeModifierOverride} from "../../src/setDynamicTemplateProperties";

import AttitudeModifierTemplate from "../../src/templateinterfaces/AttitudeModifierTemplate";

import * as Languages from "../../localization/defaultLanguages";

const defaultAttitudeModifiers: ModuleFile =
{
  key: "defaultAttitudeModifiers",
  metaData:
  {
    name: "Default attitude modifiers",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  constructModule: function(moduleData: ModuleData)
  {
    setAttitudeModifierOverride(AttitudeModifierTemplates);
    moduleData.copyTemplates<AttitudeModifierTemplate>(AttitudeModifierTemplates, "AttitudeModifiers");

    return moduleData;
  },
};

export default defaultAttitudeModifiers;
