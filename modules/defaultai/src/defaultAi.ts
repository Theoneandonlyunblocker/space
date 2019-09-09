import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";

import {defaultAiConstructor} from "./mapai/DefaultAiConstructor";
import {attachedUnitDataScripts} from "./attachedUnitData";
import * as moduleInfo from "../moduleInfo.json";


export const defaultAi: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(
    {
      [defaultAiConstructor.type]: defaultAiConstructor,
    }, "AiTemplateConstructors");

    moduleData.scripts.add(attachedUnitDataScripts);

    return moduleData;
  },
};
