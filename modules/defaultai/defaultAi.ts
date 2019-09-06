import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

import {defaultAiConstructor} from "./mapai/DefaultAiConstructor";
import {attachedUnitDataScripts} from "./attachedUnitData";
import * as moduleInfo from "./moduleInfo.json";


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
