import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import unitArchetypes from "../../common/unitArchetypes";
import {unitTemplates} from "./unitTemplates";
import {setBaseUrl as setAssetBaseUrl} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


const spaceUnits: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    setAssetBaseUrl(baseUrl);

    const loader = new PIXI.Loader(baseUrl);

    // also adds to pixi texture cache when loaded which is all we want to do. kinda opaque
    loader.add("units", "./img/sprites/units.json");

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
