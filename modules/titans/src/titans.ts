import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Extendables as DefaultUiExtendables} from "modules/defaultui/src/extendables";
import {GameModule} from "core/src/modules/GameModule";
import
{
  loadCss,
} from "core/src/generic/utility";

import * as moduleInfo from "../moduleInfo.json";
import { localize } from "../localization/localize";
import { TitanManufacturingOverview } from "./uicomponents/TitanManufacturingOverview";
import { copyNonCoreModuleData } from "./nonCoreModuleData";
import { registerMapLevelModifiers } from "./mapLevelModifiers";
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { cssSources } from "../assets/assets";
import {  getBuildableComponents } from "./getBuildableComponents";
import { buildingTemplates } from "./buildings/buildingTemplates";
import { manufacturableThingKinds } from "./manufacturableThingKinds.js";


export const titans: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders:
  {
    [GameModuleInitializationPhase.GameStart]:
    [
      baseUrl =>
      {
        cssSources.forEach(source => loadCss(source, baseUrl));

        return Promise.resolve();
      },
    ],
  },
  addToModuleData: moduleData =>
  {
    const customModuleData = copyNonCoreModuleData();
    moduleData.nonCoreData.titans = customModuleData;
    moduleData.templateCollectionsWithUnlockables.titanComponents = customModuleData.titanComponents;
    moduleData.manufacturableThingKinds.titanComponent =
    {
      kind: manufacturableThingKinds.titanComponent,
      templates: customModuleData.titanComponents,
    };

    registerMapLevelModifiers(moduleData);

    moduleData.copyTemplates(buildingTemplates, "Buildings");

    (moduleData.nonCoreData.defaultUi.extendables as DefaultUiExtendables).manufacturableThingKinds.titans =
    {
      displayOrder: 1,
      get buttonString()
      {
        return localize("manufactureTitansButton");
      },
      getManufacturableThings: manufactory => getBuildableComponents(manufactory),
      render: props => TitanManufacturingOverview(props),
    };
  },
};
