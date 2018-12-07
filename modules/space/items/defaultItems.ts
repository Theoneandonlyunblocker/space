import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";
import ItemTemplate from "../../../src/templateinterfaces/ItemTemplate";

import {itemTemplates} from "./itemTemplates";


const defaultItems: ModuleFile =
{
  metaData:
  {
    key: "defaultItems",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates<ItemTemplate>(itemTemplates, "Items");

    return moduleData;
  },
};

export default defaultItems;
