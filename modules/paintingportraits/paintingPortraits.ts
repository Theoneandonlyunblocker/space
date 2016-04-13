import ModuleFile from "../../src/ModuleFile";
import ModuleData from "../../src/ModuleData";
import paintingPortraitsCulture from "./paintingPortraitsCulture";
import CultureTemplate from "../../src/templateinterfaces/CultureTemplate";

const paintingPortraits: ModuleFile =
{
  key: "paintingPortraits",
  metaData:
  {
    name: "Painting portraits",
    version: "0.1.0",
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

export default paintingPortraits;
