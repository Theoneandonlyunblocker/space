import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import unitArchetypes from "../../common/unitArchetypes";
import {unitTemplates} from "./unitTemplates";


const spaceUnits: ModuleFile =
{
  info:
  {
    key: "spaceUnits",
    version: "0.1.0",
    author: "giraluna",
    description: "",
    modsToReplace: ["defaultUnits"],
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: () =>
  {
    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "units";

    // also adds to pixi texture cache when loaded which is all we want to do. kinda opaque
    loader.add(spriteSheetKey, "modules/space/units/img/sprites/units.json");

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
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

export default spaceUnits;
