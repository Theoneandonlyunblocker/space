import ItemTemplates from "./ItemTemplates";

import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import ItemTemplate from "../../src/templateinterfaces/ItemTemplate";

import * as Languages from "../../localization/defaultLanguages";


const defaultItems: ModuleFile =
{
  key: "defaultItems",
  metaData:
  {
    name: "Default items",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<ItemTemplate>(ItemTemplates, "Items");

    return moduleData;
  },
};

export default defaultItems;
