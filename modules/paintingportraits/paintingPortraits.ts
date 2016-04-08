import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";
import paintingPortraitsCulture from "./paintingPortraitsCulture.ts";
import CultureTemplate from "../../src/templateinterfaces/CultureTemplate.d.ts";

export var moduleFile: ModuleFile =
{
  key: "paintingPortraits",
  metaData:
  {
    name: "paintingPortraits",
    version: "0.0.420",
    author: "various artists",
    description: "old ppl"
  },
  loadAssets: function(onLoaded: () => void)
  {
    onLoaded();
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<CultureTemplate>({paintingPortraits: paintingPortraitsCulture}, "Cultures");

    return moduleData;
  }
}
