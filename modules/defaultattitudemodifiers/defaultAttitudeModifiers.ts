import {englishLanguage} from "../englishlanguage/englishLanguage";
import {ModuleFile} from "../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../src/ModuleFileInitializationPhase";

import {attitudeModifierTemplates} from "./attitudeModifierTemplates";
import {attitudeModifierModuleScripts} from "./attitudeModifierModuleScripts";

import * as moduleInfo from "./moduleInfo.json";

export const defaultAttitudeModifiers: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(attitudeModifierTemplates, "AttitudeModifiers");

    moduleData.scripts.add(attitudeModifierModuleScripts);

    return moduleData;
  },
};
