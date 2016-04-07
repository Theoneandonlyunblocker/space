import ItemTemplates from "./ItemTemplates.ts";

import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import ItemTemplate from "../../src/templateinterfaces/ItemTemplate.d.ts";

const defaultItems: ModuleFile =
{
  key: "defaultItems",
  metaData:
  {
    name: "Default items",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<ItemTemplate>(ItemTemplates, "Items");
    
    return moduleData;
  }
}

export default defaultItems;
