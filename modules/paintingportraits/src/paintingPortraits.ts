import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";

import {paintingPortraitTemplates} from "./paintingPortraitTemplates";
import {setBaseUrl as setAssetBaseUrl} from "../assets/assets";

import * as moduleInfo from "../moduleInfo.json";


export const paintingPortraits: GameModule =
{
  info: moduleInfo,
  supportedLanguages: "all",
  assetLoaders:
  {
    [GameModuleInitializationPhase.MapGen]:
    [
      (baseUrl) =>
      {
        setAssetBaseUrl(baseUrl);

        return Promise.resolve();
      },
    ],
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(paintingPortraitTemplates, "portraits");

    return moduleData;
  },
};
