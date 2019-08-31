import {englishLanguage} from "../englishlanguage/englishLanguage";
import {GameModule} from "../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../src/modules/GameModuleInitializationPhase";

import {attitudeModifierTemplates} from "./attitudeModifierTemplates";
import {attitudeModifierModuleScripts} from "./attitudeModifierModuleScripts";

import * as moduleInfo from "./moduleInfo.json";

export const defaultAttitudeModifiers: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(attitudeModifierTemplates, "AttitudeModifiers");

    moduleData.scripts.add(attitudeModifierModuleScripts);

    return moduleData;
  },
};
