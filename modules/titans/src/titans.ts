import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {Extendables as DefaultUiExtendables, ManufacturableThingKindUiData} from "modules/defaultui/src/extendables";
import {GameModule} from "core/src/modules/GameModule";
import
{
  loadCss, remapObjectKeys,
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
import * as semver from "core/src/generic/versions";
import * as debug from "core/src/app/debug";
import { OutdatedFullSaveData } from "core/src/saves/reviveSaveData";


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

    registerMapLevelModifiers(moduleData);

    moduleData.templates.buildings.copyTemplates(buildingTemplates);

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
  reviveGameData: saveData =>
  {
    const dataVersion = saveData.appVersion;

    if (semver.lt(dataVersion, "0.7.0"))
    {
      debug.log("saves", `Executing stored core save data reviver function 'remapTitanSaveDataKeys'`);
      remapTitanSaveDataKeys();
    }

    function remapTitanSaveDataKeys()
    {
      (saveData as OutdatedFullSaveData).gameData.galaxyMap.stars.filter(star =>
      {
        return Boolean(star.manufactory);
      }).forEach(star =>
      {
        star.manufactory.buildQueue.filter(queuedThing =>
        {
          return queuedThing.kind === manufacturableThingKinds.titanFromPrototype.key;
        }).forEach(queuedTitanPrototype =>
        {
          remapObjectKeys(queuedTitanPrototype.data,
          {
            type: "key",
            chassisType: "chassis",
            componentTypes: "components",
          });
        });
      });
    }
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
