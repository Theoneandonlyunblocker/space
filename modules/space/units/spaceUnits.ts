import * as PIXI from "pixi.js";

import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

import {unitArchetypes} from "modules/common/unitArchetypes";
import {unitTemplates} from "./unitTemplates";
import {setBaseUrl as setAssetBaseUrl} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


export const spaceUnits: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.MapGen,
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
