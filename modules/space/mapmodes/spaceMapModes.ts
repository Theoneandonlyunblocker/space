import * as PIXI from "pixi.js";

import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";

import {mapLayerTemplates} from "./mapLayerTemplates";
import {mapModeTemplates} from "./mapModeTemplates";
import {resources} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


export const spaceMapModes: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    loader.add("fowTexture", "./img/fowTexture.png");

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        resources.fogOfWarTexture = loader.resources.fowTexture.texture;

        resolve();
      });
    });
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(mapLayerTemplates, "MapRendererLayers");
    moduleData.copyTemplates(mapModeTemplates, "MapRendererMapModes");

    return moduleData;
  },
};
