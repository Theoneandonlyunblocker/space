/// <reference path="../../lib/pixi.d.ts" />

import UnitArchetypes from "./UnitArchetypes";
import UnitTemplates from "./UnitTemplates";

import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages";

import UnitArchetype from "../../src/templateinterfaces/UnitArchetype";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import * as Languages from "../../localization/defaultLanguages";


const defaultUnits: ModuleFile =
{
  key: "defaultUnits",
  metaData:
  {
    name: "Default units",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
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
    moduleData.copyTemplates<UnitTemplate>(UnitTemplates, "Units");
    moduleData.copyTemplates<UnitArchetype>(UnitArchetypes, "UnitArchetypes");

    return moduleData;
  },
};

export default defaultUnits;
