import * as Languages from "../../localization/defaultLanguages";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import AttitudeModifierTemplate from "../../src/templateinterfaces/AttitudeModifierTemplate";

import attitudeModifierTemplates from "./AttitudeModifierTemplates";
import {attitudeModifierModuleScripts} from "./attitudeModifierModuleScripts";


const defaultAttitudeModifiers: ModuleFile =
{
  metaData:
  {
    key: "defaultAttitudeModifiers",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<AttitudeModifierTemplate>(attitudeModifierTemplates, "AttitudeModifiers");

    moduleData.scripts.add(attitudeModifierModuleScripts);

    return moduleData;
  },
};

export default defaultAttitudeModifiers;
