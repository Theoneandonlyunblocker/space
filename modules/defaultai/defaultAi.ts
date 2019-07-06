import {englishLanguage} from "../englishlanguage/englishLanguage";
import {ModuleFile} from "../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../src/ModuleFileInitializationPhase";

import {defaultAiConstructor} from "./mapai/DefaultAiConstructor";
import {attachedUnitDataScripts} from "./attachedUnitData";
import * as moduleInfo from "./moduleInfo.json";


export const defaultAi: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameStart,
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
