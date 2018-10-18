import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import ItemTemplate from "../../src/templateinterfaces/ItemTemplate";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [englishLanguage],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<ItemTemplate>(itemTemplates, "Items");

    return moduleData;
  },
};

export default defaultItems;
