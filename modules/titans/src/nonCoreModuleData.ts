import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { ModuleData } from "core/src/modules/ModuleData";
import { TitanChassisTemplate } from "./TitanChassisTemplate";
import { TemplateCollection } from "core/src/generic/TemplateCollection";

export type NonCoreModuleData =
{
  titanComponents: TemplateCollection<TitanComponentTemplate>;
  getBuildableTitanComponentsForRace:
  {
    [raceKey: string]: () => TitanComponentTemplate[];
  };
  titanChassis: TemplateCollection<TitanChassisTemplate>;
  getBuildableTitanChassisForRace:
  {
    [raceKey: string]: () => TitanChassisTemplate[];
  };
  idGenerators:
  {
    titanPrototype: number;
  };
};

export function createNonCoreModuleData(): NonCoreModuleData
{
  return {
    titanComponents: new TemplateCollection<TitanComponentTemplate>("titanComponent"),
    getBuildableTitanComponentsForRace: {},
    titanChassis: new TemplateCollection<TitanChassisTemplate>("titanChassis"),
    getBuildableTitanChassisForRace: {},
    idGenerators:
    {
      titanPrototype: 0,
    },
  };
}

export function addTitanComponentsToModuleData(
  moduleData: ModuleData,
  componentsToAdd: {[key: string]: TitanComponentTemplate},
): void
{
  const existingComponents = (moduleData.nonCoreData.titans as NonCoreModuleData).titanComponents;
  existingComponents.copyTemplates(componentsToAdd);
}
export function addTitanChassisToModuleData(
  moduleData: ModuleData,
  chassisToAdd: {[key: string]: TitanChassisTemplate},
): void
{
  const existingComponents = (moduleData.nonCoreData.titans as NonCoreModuleData).titanChassis;
  existingComponents.copyTemplates(chassisToAdd);
}
