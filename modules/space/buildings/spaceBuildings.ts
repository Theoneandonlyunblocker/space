import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";
import cacheSpriteSheetAsImages from "../../../src/cacheSpriteSheetAsImages";

import buildingTemplates from "./BuildingTemplates";


const spaceBuildings: ModuleFile =
{
  info:
  {
    key: "spaceBuildings",
    version: "0.1.0",
    author: "giraluna",
    description: "",
    modsToReplace: ["defaultBuildings"],
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "buildings";
    loader.add(spriteSheetKey, "modules/space/buildings/img/buildings.json");

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        const json = loader.resources[spriteSheetKey].data;
        const image = loader.resources[spriteSheetKey + "_image"].data;
        cacheSpriteSheetAsImages(json, image);

        resolve();
      });
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(buildingTemplates, "Buildings");

    return moduleData;
  },
};

export default spaceBuildings;
