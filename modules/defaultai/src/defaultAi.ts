import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";

import {defaultAiConstructor} from "./mapai/DefaultAiConstructor";
import {attachedUnitDataScripts} from "./attachedUnitData";
import * as moduleInfo from "../moduleInfo.json";


export const defaultAi: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.templates.aiTemplateConstructors.copyTemplates(
    {
      [defaultAiConstructor.type]: defaultAiConstructor,
    });

    moduleData.scripts.add(attachedUnitDataScripts);

    return moduleData;
  },
};
