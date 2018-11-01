/// <reference path="../../lib/pixi.d.ts" />

import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";
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
  needsToBeInitializedBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (onLoaded) =>
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
