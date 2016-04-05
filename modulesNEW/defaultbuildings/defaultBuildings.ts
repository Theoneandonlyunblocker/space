import RuleSet from "../../src/RuleSet.ts";
import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages.ts";
import BuildingTemplates from "./BuildingTemplates.ts";
import BuildingTemplate from "../../src/templateinterfaces/BuildingTemplate.d.ts";

const defaultBuildings: ModuleFile =
{
  key: "defaultBuildings",
  metaData:
  {
    name: "Default Buildings",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  loadAssets: function(onLoaded: () => void)
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "buildings";
    loader.add(spriteSheetKey, "modules\/default\/img\/buildings\/buildings.json");
    loader.load(function(loader: PIXI.loaders.Loader)
    {
      const json = loader.resources[spriteSheetKey].data;
      const image = loader.resources[spriteSheetKey + "_image"].data;
      cacheSpriteSheetAsImages(json, image);
    });
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<BuildingTemplate>(BuildingTemplates, "Buildings");
    
    return moduleData;
  }
}

export default defaultBuildings;
