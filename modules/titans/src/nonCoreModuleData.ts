import { TitanComponentTemplate } from "./TitanComponentTemplate";
import { TemplateCollection } from "core/src/templateinterfaces/TemplateCollection";
import { ModuleData } from "core/src/modules/ModuleData";
import { TitanChassisTemplate } from "./TitanChassisTemplate";


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
};

const nonCoreModuleData: NonCoreModuleData =
{
  titanComponents: {},
  getBuildableTitanComponentsForRace: {},
  titanChassis: {},
  getBuildableTitanChassisForRace: {},
};

export function copyNonCoreModuleData(): NonCoreModuleData
{
  return {
    titanComponents: {...nonCoreModuleData.titanComponents},
    getBuildableTitanComponentsForRace: {...nonCoreModuleData.getBuildableTitanComponentsForRace},
    titanChassis: {...nonCoreModuleData.titanChassis},
    getBuildableTitanChassisForRace: {...nonCoreModuleData.getBuildableTitanChassisForRace},
  };
}

export function addTitanComponentsToModuleData(
  moduleData: ModuleData,
  componentsToAdd: TemplateCollection<TitanComponentTemplate>,
): void
{
  const existingComponents = (moduleData.nonCoreData.titans as NonCoreModuleData).titanComponents;

  for (const key in componentsToAdd)
  {
    if (existingComponents[key])
    {
      throw new Error(`Duplicate titan component template '${key}'`);
    }

    existingComponents[key] = componentsToAdd[key];
  }

  moduleData.technologyUnlocksAreDirty = true;
}
export function addTitanChassisToModuleData(
  moduleData: ModuleData,
  chassisToAdd: TemplateCollection<TitanChassisTemplate>,
): void
{
  const existingComponents = (moduleData.nonCoreData.titans as NonCoreModuleData).titanChassis;

  for (const key in chassisToAdd)
  {
    if (existingComponents[key])
    {
      throw new Error(`Duplicate titan component template '${key}'`);
    }

    existingComponents[key] = chassisToAdd[key];
  }

  moduleData.technologyUnlocksAreDirty = true;
}
