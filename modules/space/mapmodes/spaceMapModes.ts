import * as PIXI from "pixi.js";

import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {GameModule} from "../../../src/GameModule";
import {GameModuleInitializationPhase} from "../../../src/GameModuleInitializationPhase";

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
