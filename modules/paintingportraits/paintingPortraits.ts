import {GameModule} from "../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../src/modules/GameModuleInitializationPhase";

import {paintingPortraitTemplates} from "./paintingPortraitTemplates";
import {setBaseUrl as setAssetBaseUrl} from "./assets";

import * as moduleInfo from "./moduleInfo.json";


export const paintingPortraits: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.MapGen,
  supportedLanguages: "all",
  initialize: (baseUrl) =>
  {
    setAssetBaseUrl(baseUrl);

    return Promise.resolve();
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(paintingPortraitTemplates, "Portraits");

    return moduleData;
  },
};
