/// <reference path="../../lib/pixi.d.ts" />

import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
import cacheSpriteSheetAsImages from "../../src/cacheSpriteSheetAsImages";
import {BuildingTemplate} from "../../src/templateinterfaces/BuildingTemplate";

import buildingTemplates from "./BuildingTemplates";


const defaultBuildings: ModuleFile =
{
  metaData:
  {
    key: "defaultBuildings",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (onLoaded) =>
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
    moduleData.copyTemplates<BuildingTemplate>(buildingTemplates, "Buildings");

    return moduleData;
  },
};

export default defaultBuildings;
