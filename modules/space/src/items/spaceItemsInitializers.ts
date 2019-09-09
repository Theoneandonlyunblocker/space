import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitialization";
import {setBaseUrl as setAssetBaseUrl} from "modules/space/assets/baseUrl";


export const spaceItemsInitializers =
{
  [GameModuleInitializationPhase.MapGen]: (baseUrl: string) =>
  {
    // TODO 2019.09.16 | do this somewhere else
    setAssetBaseUrl(baseUrl);

    return Promise.resolve();
  },
};
