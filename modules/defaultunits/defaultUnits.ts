/// <reference path="../../lib/pixi.d.ts" />

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
    
    loader.add(spriteSheetKey, "modules\/defaultunits\/img\/sprites\/units.json");
    
    // TODO refactor | can't sfx function load these?
    loader.add("explosion", "modules\/common\/battlesfxfunctions\/img\/explosion.json");
    loader.add("modules\/common\/battlesfxfunctions\/img\/rocket.png");
    
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
    moduleData.copyTemplates<UnitTemplate>(UnitTemplates, "Units");
    
    return moduleData;
  }
}

export default defaultUnits;
