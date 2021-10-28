import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";

import {attitudeModifierTemplates} from "./attitudeModifierTemplates";
import {attitudeModifierModuleScripts} from "./attitudeModifierModuleScripts";

import * as moduleInfo from "../moduleInfo.json";

export const defaultAttitudeModifiers: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.templates.attitudeModifiers.copyTemplates(attitudeModifierTemplates);

    moduleData.scripts.add(attitudeModifierModuleScripts);

    return moduleData;
  },
};
