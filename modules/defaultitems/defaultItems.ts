import ItemTemplates from "./ItemTemplates";

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import ItemTemplate from "../../src/templateinterfaces/ItemTemplate";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.mapGen,
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<ItemTemplate>(ItemTemplates, "Items");

    return moduleData;
  },
};

export default defaultItems;
