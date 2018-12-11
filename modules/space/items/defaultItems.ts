import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import {itemTemplates} from "./itemTemplates";


const defaultItems: ModuleFile =
{
  info:
  {
    key: "defaultItems",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(itemTemplates, "Items");

    return moduleData;
  },
};

export default defaultItems;
