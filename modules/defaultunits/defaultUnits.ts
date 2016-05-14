/// <reference path="../../lib/pixi.d.ts" />

import UnitTemplates from "./UnitTemplates";
import UnitFamilies from "./UnitFamilies";
import UnitArchetypes from "./UnitArchetypes";

import ModuleFile from "../../src/ModuleFile";
import ModuleData from "../../src/ModuleData";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages";
import {setUnitFamilyAssociatedTemplates} from "../../src/setDynamicTemplateProperties";

import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";
import UnitFamily from "../../src/templateinterfaces/UnitFamily";
import UnitArchetype from "../../src/templateinterfaces/UnitArchetype";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.mapGen,
  loadAssets: function(onLoaded: () => void)
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "units";
    
    loader.add(spriteSheetKey, "modules/defaultunits/img/sprites/units.json");

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
    setUnitFamilyAssociatedTemplates(UnitTemplates);
    
    moduleData.copyTemplates<UnitTemplate>(UnitTemplates, "Units");
    moduleData.copyTemplates<UnitFamily>(UnitFamilies, "UnitFamilies");
    moduleData.copyTemplates<UnitArchetype>(UnitArchetypes, "UnitArchetypes");
    
    return moduleData;
  }
}

export default defaultUnits;
