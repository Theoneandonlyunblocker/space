import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";
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

    return new Promise<void>(resolve =>
    {
      loader.load(resolve);
    });
  },
};
