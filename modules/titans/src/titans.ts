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
import { copyNonCoreModuleData, NonCoreModuleData } from "./nonCoreModuleData";
import { registerMapLevelModifiers } from "./mapLevelModifiers";
import { GameModuleInitializationPhase } from "core/src/modules/GameModuleInitializationPhase";
import { cssSources } from "../assets/assets";
import {  getBuildableComponents } from "./getBuildableComponents";
import { buildingTemplates } from "./buildings/buildingTemplates";
import { manufacturableThingKinds } from "./manufacturableThingKinds";
import { TitanPrototypeSaveData, serializeTitanPrototype, deserializeTitanPrototype } from "./TitanPrototype";


type PerPlayerCollection<T> =
{
  [playerId: number]:
  {
    [key: string]: T;
  };
};
type TitanPrototypeSaveDataPerPlayer = PerPlayerCollection<TitanPrototypeSaveData>;
type TitansModuleSaveData =
{
  titanPrototypesPerPlayer: TitanPrototypeSaveDataPerPlayer;
};
function mapPerPlayerCollection<I, O>(input: PerPlayerCollection<I>, mapFN: (input: I) => O): PerPlayerCollection<O>
{
  return Object.keys(input).reduce((allPlayers, playerKey) =>
  {
    const inputForPlayer = input[playerKey];

    allPlayers[playerKey] = Object.keys(inputForPlayer).reduce((allInputsForPlayer, inputKey) =>
    {
      allInputsForPlayer[inputKey] = mapFN(inputForPlayer[inputKey]);

      return allInputsForPlayer;
    }, <{[key: string]: O}>{});

    return allPlayers;
  }, <PerPlayerCollection<O>>{});
}


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
    const customModuleData = copyNonCoreModuleData();
    moduleData.nonCoreData.titans = customModuleData;

    moduleData.templateCollectionsWithUnlockables.titanComponents = customModuleData.titanComponents;
    moduleData.manufacturableThingKinds.titanComponent =
    {
      kind: manufacturableThingKinds.titanComponent,
      templates: customModuleData.titanComponents,
    };
    moduleData.templateCollectionsWithUnlockables.titanChassis = customModuleData.titanChassis;

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
  serializeModuleSpecificData: (moduleData) =>
  {
    const titanPrototypesPerPlayer = (moduleData.nonCoreData.titans as NonCoreModuleData).titanPrototypesPerPlayer;

    return {
      titanPrototypesPerPlayer: mapPerPlayerCollection(titanPrototypesPerPlayer, serializeTitanPrototype),
    };
  },
  deserializeModuleSpecificData: (moduleData, saveData) =>
  {
    const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

    titansModuleData.titanPrototypesPerPlayer =
      mapPerPlayerCollection(saveData.titanPrototypesPerPlayer, deserializeTitanPrototype.bind(null, moduleData));
  },
};
