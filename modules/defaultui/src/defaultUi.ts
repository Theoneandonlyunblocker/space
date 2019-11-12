import * as PIXI from "pixi.js";

import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";
import {loadCss} from "core/src/generic/utility";
import
{
  cachedAssets,
  setBaseUrl as setAssetBaseUrl,
  assetSources,
} from "../assets/assets";

import * as moduleInfo from "../moduleInfo.json";
import { triggeredScripts } from "./triggeredScripts";
import { copyExtendables } from "./extendables";
import { uiScenes } from "./uiScenes";


export const defaultUi: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders:
  {
    [GameModuleInitializationPhase.AppInit]:
    [
      (baseUrl) =>
      {
        loadCss(assetSources.css, baseUrl);
        setAssetBaseUrl(baseUrl);

        const loader = new PIXI.Loader(baseUrl);

        const battleSceneFlagFadeUrl = assetSources.battleSceneFlagFade;
        loader.add(
        {
          url: battleSceneFlagFadeUrl,
          loadType: 1, // XML
        });

        return new Promise(resolve =>
        {
          loader.load(() =>
          {
            const response = <XMLDocument> loader.resources[battleSceneFlagFadeUrl].data;
            const svgDoc = <SVGElement> response.children[0];
            cachedAssets.battleSceneFlagFade = svgDoc;

            resolve();
          });
        });
      },
    ],
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.scripts.add(triggeredScripts);

    for (const key in uiScenes)
    {
      moduleData.uiScenes[key] = uiScenes[key];
    }

    moduleData.nonCoreData.defaultUi =
    {
      extendables: copyExtendables(),
    };

    return moduleData;
  },
};
