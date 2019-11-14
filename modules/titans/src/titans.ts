import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Extendables as DefaultUiExtendables} from "modules/defaultui/src/extendables";
import {GameModule} from "core/src/modules/GameModule";
import
{
  getUniqueArrayKeys, loadCss,
} from "core/src/generic/utility";

import * as moduleInfo from "../moduleInfo.json";
import { localize } from "../localization/localize";
import { TitanManufacturingOverview } from "./uicomponents/TitanManufacturingOverview";
import { copyNonCoreModuleData, NonCoreModuleData } from "./nonCoreModuleData";
import { registerMapLevelModifiers } from "./mapLevelModifiers";
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { cssSources } from "../assets/assets";
import { getBuildableComponentsForRace } from "./getBuildableComponentsForRace";
import { getAlwaysAvailableBuildableThings } from "core/src/production/getAlwaysAvailableBuildableThings";
import { activeModuleData } from "core/src/app/activeModuleData";
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
      getManufacturableThings: manufactory =>
      {
        const alwaysAvailableComponents = getAlwaysAvailableBuildableThings((activeModuleData.nonCoreData.titans as NonCoreModuleData).titanComponents);
        const ownerComponents = getBuildableComponentsForRace(manufactory.owner.race);
        const localComponents = getBuildableComponentsForRace(manufactory.star.localRace);

        const allComponents = [
          ...alwaysAvailableComponents,
          ...ownerComponents,
          ...localComponents,
        ];
        const uniqueComponents = getUniqueArrayKeys(allComponents, component => component.type);

        const manufacturableComponents = uniqueComponents.filter(component =>
        {
          return !component.techRequirements ||
            manufactory.owner.meetsTechRequirements(component.techRequirements);
        });

        return manufacturableComponents;
      },
      render: props => TitanManufacturingOverview(props),
    };
  },
};
