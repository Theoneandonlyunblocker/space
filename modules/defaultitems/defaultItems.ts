import * as Languages from "../../localization/defaultLanguages";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import ItemTemplate from "../../src/templateinterfaces/ItemTemplate";

import {itemTemplates} from "./itemTemplates";


const defaultItems: ModuleFile =
{
  key: "defaultItems",
  metaData:
  {
    key: "Default items",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<ItemTemplate>(itemTemplates, "Items");

    return moduleData;
  },
};

export default defaultItems;
