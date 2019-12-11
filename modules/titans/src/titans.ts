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
import { TitanPrototypeSaveData, TitanPrototype } from "./TitanPrototype";
import { getBuildablePrototypes } from "./getBuildablePrototypes";


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
  idGenerators:
  {
    titanPrototype: number;
  };
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
    const customModuleData = createNonCoreModuleData();
    moduleData.nonCoreData.titans = customModuleData;

    // unneeded, as these are added to moduleData.templates.units / items
    // moduleData.templateCollectionsWithUnlockables.titanChassis = customModuleData.titanChassis;
    // moduleData.templateCollectionsWithUnlockables.titanComponents = customModuleData.titanComponents;

    moduleData.manufacturableThingKinds.titanFromPrototype =
    {
      kind: manufacturableThingKinds.titanFromPrototype,
      templates: customModuleData.titanPrototypes,
    };

    registerMapLevelModifiers(moduleData);

    moduleData.copyTemplates(buildingTemplates, "Buildings");

    (moduleData.nonCoreData.defaultUi.extendables as DefaultUiExtendables).manufacturableThingKinds.titans = <ManufacturableThingKindUiData<TitanPrototype>>
    {
      displayOrder: 1,
      get buttonString()
      {
        return localize("manufactureTitansButton");
      },
      getManufacturableThings: manufactory => getBuildablePrototypes(manufactory),
      render: props => TitanManufacturingOverview(props),
    };
  },
  serializeModuleSpecificData: (moduleData) =>
  {
    const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

    return {
      idGenerators: {...titansModuleData.idGenerators},
      titanPrototypesPerPlayer: mapPerPlayerCollection(
        titansModuleData.titanPrototypesPerPlayer,
        prototype => prototype.serialize(),
      ),
    };
  },
  deserializeModuleSpecificData: (moduleData, saveData) =>
  {
    const titansModuleData = (moduleData.nonCoreData.titans as NonCoreModuleData);

    titansModuleData.idGenerators = {...saveData.idGenerators};
    titansModuleData.titanPrototypesPerPlayer = mapPerPlayerCollection(
      saveData.titanPrototypesPerPlayer,
      prototypeSaveData =>
      {
        const prototype = TitanPrototype.fromData(moduleData, prototypeSaveData);
        titansModuleData.titanPrototypes[prototype.type] = prototype;

        return prototype;
      },
    );
  },
};
