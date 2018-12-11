import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";
import cacheSpriteSheetAsImages from "../../../src/cacheSpriteSheetAsImages";

import unitArchetypes from "../../common/unitArchetypes";
import {unitTemplates} from "./unitTemplates";


const defaultUnits: ModuleFile =
{
  info:
  {
    key: "defaultUnits",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "units";

    loader.add(spriteSheetKey, "modules/space/units/img/sprites/units.json");

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
    moduleData.copyTemplates(unitTemplates, "Units");
    moduleData.copyTemplates(unitArchetypes, "UnitArchetypes");

    return moduleData;
  },
};

export default defaultUnits;
