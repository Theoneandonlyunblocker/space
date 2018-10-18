/// <reference path="../../lib/pixi.d.ts" />

import * as Languages from "../../localization/defaultLanguages";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages";
import UnitArchetype from "../../src/templateinterfaces/UnitArchetype";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import unitArchetypes from "./unitArchetypes";
import {unitTemplates} from "./unitTemplates";


const defaultUnits: ModuleFile =
{
  metaData:
  {
    key: "defaultUnits",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  loadAssets: (onLoaded) =>
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "units";

    loader.add(spriteSheetKey, "modules/defaultunits/img/sprites/units.json");

    loader.load(() =>
    {
      const json = loader.resources[spriteSheetKey].data;
      const image = loader.resources[spriteSheetKey + "_image"].data;
      cacheSpriteSheetAsImages(json, image);

      onLoaded();
    });
  },
  constructModule: (moduleData) =>
  {
    moduleData.copyTemplates<UnitTemplate>(unitTemplates, "Units");
    moduleData.copyTemplates<UnitArchetype>(unitArchetypes, "UnitArchetypes");

    return moduleData;
  },
};

export default defaultUnits;
