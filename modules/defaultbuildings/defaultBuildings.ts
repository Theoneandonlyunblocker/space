/// <reference path="../../lib/pixi.d.ts" />

import BuildingTemplates from "./BuildingTemplates";

import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages";

import BuildingTemplate from "../../src/templateinterfaces/BuildingTemplate";

import * as Languages from "../../localization/defaultLanguages";


const defaultBuildings: ModuleFile =
{
  key: "defaultBuildings",
  metaData:
  {
    name: "Default Buildings",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.MapGen,
  supportedLanguages: [Languages.en],
  loadAssets: (onLoaded) =>
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "buildings";
    loader.add(spriteSheetKey, "modules/defaultbuildings/img/buildings.json");
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
    moduleData.copyTemplates<BuildingTemplate>(BuildingTemplates, "Buildings");

    return moduleData;
  },
};

export default defaultBuildings;
