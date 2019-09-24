import * as PIXI from "pixi.js";

import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";


export const spaceUnitsInitializers =
{
  [GameModuleInitializationPhase.MapGen]: (baseUrl: string) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    // also adds to pixi texture cache when loaded which is all we want to do. kinda opaque
    loader.add("units", "./assets/units/img/sprites/units.json");

    return new Promise<void>(resolve =>
    {
      loader.load(() =>
      {
        resolve();
      });
    });
  },
};
