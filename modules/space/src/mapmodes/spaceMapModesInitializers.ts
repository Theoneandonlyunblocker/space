import * as PIXI from "pixi.js";

import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitialization";
import {mapModeAssets} from "modules/space/assets/mapModes/mapModeAssets";


export const spaceMapModesInitializers =
{
  [GameModuleInitializationPhase.GameStart]: (baseUrl: string) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    loader.add("fowTexture", "./assets/mapmodes/img/fowTexture.png");

    return new Promise<void>(resolve =>
    {
      loader.load(() =>
      {
        mapModeAssets.fogOfWarTexture = loader.resources.fowTexture.texture;

        resolve();
      });
    });
  },
};
