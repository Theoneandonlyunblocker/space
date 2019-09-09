import * as PIXI from "pixi.js";

import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitialization";
import {setBaseUrl as setAssetBaseUrl} from "modules/space/assets/baseUrl";


export const spaceUnitsInitializers =
{
  [GameModuleInitializationPhase.MapGen]: (baseUrl: string) =>
  {
    // TODO 2019.09.16 | do this somewhere else
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
};
