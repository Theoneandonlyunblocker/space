import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";
import {loadCss} from "core/src/generic/utility";
import
{
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

        return Promise.resolve();
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
