import * as PIXI from "pixi.js";

import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";

import
{
  setBaseUrl as setAssetsBaseUrl,
  assetSources,
  assetsToLoadIntoTextureCache,
} from "./assets";
import * as moduleInfo from "./moduleInfo.json";
import { englishLanguage } from "modules/englishlanguage/src/englishLanguage";
import { combatAbilityTemplates } from "./src/combat/combatAbilityTemplates";


// TODO 2020.02.15 | rename (baselib?) & reorganize
export const common: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders:
  {
    [GameModuleInitializationPhase.GameSetup]:
    [
      (baseUrl) =>
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
    ]
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(combatAbilityTemplates, "combatAbilities");
  },
};
