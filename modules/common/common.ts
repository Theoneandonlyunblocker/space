import * as PIXI from "pixi.js";

import {GameModule} from "../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../src/modules/GameModuleInitializationPhase";

import
{
  setBaseUrl as setAssetsBaseUrl,
  assetSources,
  assetsToLoadIntoTextureCache,
} from "./assets";
import * as moduleInfo from "./moduleInfo.json";


export const common: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameSetup,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    setAssetsBaseUrl(baseUrl);

    const loader = new PIXI.Loader(baseUrl);

    assetsToLoadIntoTextureCache.forEach(assetKey =>
    {
      loader.add(assetKey, assetSources[assetKey]);
    });

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
};
