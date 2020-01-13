import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Extendables as DefaultUiExtendables, ManufacturableThingKindUiData} from "modules/defaultui/src/extendables";
import {GameModule} from "core/src/modules/GameModule";
import
{
  loadCss,
} from "core/src/generic/utility";

import * as moduleInfo from "../moduleInfo.json";
import { localize } from "../localization/localize";
import { TitanManufacturingOverview } from "./uicomponents/TitanManufacturingOverview";
import { createNonCoreModuleData, NonCoreModuleData } from "./nonCoreModuleData";
import { registerMapLevelModifiers } from "./mapLevelModifiers";
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { cssSources } from "../assets/assets";
import { buildingTemplates } from "./buildings/buildingTemplates";
import { manufacturableThingKinds } from "./manufacturableThingKinds";
import {  TitanPrototype } from "./TitanPrototype";


type TitansModuleSaveData =
{
  idGenerators:
  {
    titanPrototype: number;
  };
};

export const titans: GameModule<TitansModuleSaveData> =
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
    const customModuleData = createNonCoreModuleData();

    moduleData.nonCoreData.titans = customModuleData;
    moduleData.manufacturableThingKinds.titanFromPrototype = manufacturableThingKinds.titanFromPrototype;
    moduleData.templateCollectionsByImplementation.unitLike.titanChassis = customModuleData.titanChassis;
    moduleData.templateCollectionsByImplementation.itemLike.titanComponents = customModuleData.titanComponents;

    registerMapLevelModifiers(moduleData);

    moduleData.copyTemplates(buildingTemplates, "Buildings");

    (moduleData.nonCoreData.defaultUi.extendables as DefaultUiExtendables).manufacturableThingKinds.titans = <ManufacturableThingKindUiData<TitanPrototype>>
    {
      displayOrder: 1,
      get buttonString()
      {
        return localize("manufactureTitansButton");
      },
      getManufacturableThings: manufactory => [],
      render: props => TitanManufacturingOverview(props),
    };
  },
  serializeModuleSpecificData: (moduleData) =>
  {
    const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

    return {
      idGenerators: {...titansModuleData.idGenerators},
    };
  },
  deserializeModuleSpecificData: (moduleData, saveData) =>
  {
    const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

    titansModuleData.idGenerators = {...saveData.idGenerators};
  },
};
