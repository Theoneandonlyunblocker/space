import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitialization";
import {battleVfxAssetsToLoad} from "modules/space/assets/battleVfx/battleVfxAssets";


export const spaceBattleVfxInitializers =
{
  [GameModuleInitializationPhase.BattleStart]: (baseUrl: string) =>
  {
    const loader = new PIXI.Loader(baseUrl);

    for (const key in battleVfxAssetsToLoad)
    {
      loader.add(key, battleVfxAssetsToLoad[key]);
    }

    return new Promise(resolve =>
    {
      loader.load(resolve);
    });
  },
};
