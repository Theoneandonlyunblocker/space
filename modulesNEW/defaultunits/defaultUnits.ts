import UnitTemplates from "./UnitTemplates.ts";

import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages.ts";

import UnitTemplate from "../../src/templateinterfaces/UnitTemplate.d.ts";

const defaultUnits: ModuleFile =
{
  key: "defaultUnits",
  metaData:
  {
    name: "Default units",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  loadAssets: function(onLoaded: () => void)
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "units";
    loader.add(spriteSheetKey, "modules\/common\/defaultUnits\/img\/sprites\/units.json");
    loader.load(function(loader: PIXI.loaders.Loader)
    {
      const json = loader.resources[spriteSheetKey].data;
      const image = loader.resources[spriteSheetKey + "_image"].data;
      cacheSpriteSheetAsImages(json, image);
      
      onLoaded();
    });
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<UnitTemplate>(UnitTemplates, "Unit");
    
    return moduleData;
  }
}

export default defaultUnits;
