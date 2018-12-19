import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import unitArchetypes from "../../common/unitArchetypes";
import {unitTemplates} from "./unitTemplates";
import {setBaseUrl as setResourceBaseUrl} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


const spaceUnits: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    setResourceBaseUrl(baseUrl);

    const loader = new PIXI.loaders.Loader();
    const spriteSheetKey = "units";
    const spriteSheetUrl = baseUrl + "./img/sprites/units.json";

    // also adds to pixi texture cache when loaded which is all we want to do. kinda opaque
    loader.add(spriteSheetKey, spriteSheetUrl);

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
